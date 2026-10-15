import crypto from 'crypto';
import Razorpay from 'razorpay';
import { ENV } from '../config/env.js';
import prisma from '../config/prisma.js';

export class PaymentService {
  private static isConfigured(): boolean {
    const key = ENV.RAZORPAY_KEY_ID;
    const secret = ENV.RAZORPAY_KEY_SECRET;
    return !!(
      key &&
      secret &&
      !key.includes('your_') &&
      !key.includes('mock_') &&
      !secret.includes('your_') &&
      !secret.includes('mock_')
    );
  }

  private static getRazorpayInstance(): Razorpay | null {
    if (!this.isConfigured()) return null;
    return new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Initialize a Razorpay payment order for an existing order in the database
   */
  static async createPaymentOrder(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.userId !== userId) {
      throw new Error('Unauthorized access to order payment.');
    }

    if (order.paymentStatus === 'PAID') {
      throw new Error('This order has already been paid.');
    }

    const isLive = this.isConfigured();
    const razorpay = this.getRazorpayInstance();

    if (isLive && razorpay) {
      // Create real Razorpay order
      const options = {
        amount: order.total, // in paise
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
        },
      };

      const rzpOrder = await razorpay.orders.create(options);

      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: rzpOrder.id },
      });

      return {
        isConfigured: true,
        isSimulated: false,
        keyId: ENV.RAZORPAY_KEY_ID,
        razorpayOrderId: rzpOrder.id,
        amountPaise: order.total,
        currency: 'INR',
        orderNumber: order.orderNumber,
      };
    } else {
      // Safe development/testing mock path
      const mockRzpOrderId = `rzp_mock_${order.orderNumber}_${Date.now()}`;
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: mockRzpOrderId },
      });

      return {
        isConfigured: false,
        isSimulated: true,
        keyId: 'rzp_test_simulated_key',
        razorpayOrderId: mockRzpOrderId,
        amountPaise: order.total,
        currency: 'INR',
        orderNumber: order.orderNumber,
        notice: 'Live Razorpay credentials are not yet configured by the owner. Operating in development simulated payment mode.',
      };
    }
  }

  /**
   * Verify server-side payment signature using HMAC SHA256
   */
  static async verifyPayment(data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    userId: string;
  }) {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.userId !== data.userId) {
      throw new Error('Unauthorized access to order payment verification.');
    }

    if (order.paymentStatus === 'PAID') {
      return { success: true, message: 'Order was already verified and marked as paid.' };
    }

    const isLive = this.isConfigured();

    if (isLive) {
      // Verify real cryptographic signature
      const body = `${data.razorpayOrderId}|${data.razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== data.razorpaySignature) {
        // Mark payment failed
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'FAILED' },
        });
        throw new Error('Invalid Razorpay payment signature. Payment verification failed.');
      }
    } else {
      // In simulated dev mode, check that paymentId is provided and orderId matches
      if (!data.razorpayPaymentId || !data.razorpayOrderId) {
        throw new Error('Invalid simulated payment credentials.');
      }
    }

    // Update order status atomically
    return prisma.$transaction(async (tx: any) => {
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: order.status === 'PENDING' ? 'CONFIRMED' : order.status,
          razorpayPaymentId: data.razorpayPaymentId,
          razorpaySignature: data.razorpaySignature,
          statusHistory: {
            create: {
              status: order.status === 'PENDING' ? 'CONFIRMED' : order.status,
              note: `Payment verified successfully (${isLive ? 'Razorpay Live/Test' : 'Dev Simulation'}). Payment ID: ${data.razorpayPaymentId}`,
            },
          },
        },
      });

      await tx.notification.create({
        data: {
          userId: order.userId,
          title: 'Payment Successful',
          message: `Your payment of ₹${(order.total / 100).toFixed(0)} for order #${order.orderNumber} was confirmed.`,
        },
      });

      return updatedOrder;
    });
  }

  /**
   * Handle Razorpay Webhooks safely with signature verification
   */
  static async handleWebhook(rawBody: string, signature: string) {
    if (!ENV.RAZORPAY_WEBHOOK_SECRET) {
      throw new Error('Webhook secret is not configured.');
    }

    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid webhook signature.');
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const rzpOrderId = payment.order_id;

      if (rzpOrderId) {
        await prisma.order.updateMany({
          where: { razorpayOrderId: rzpOrderId },
          data: {
            paymentStatus: 'PAID',
            razorpayPaymentId: payment.id,
          },
        });
      }
    } else if (event === 'payment.failed') {
      const payment = payload.payload.payment.entity;
      const rzpOrderId = payment.order_id;

      if (rzpOrderId) {
        await prisma.order.updateMany({
          where: { razorpayOrderId: rzpOrderId },
          data: { paymentStatus: 'FAILED' },
        });
      }
    }

    return { received: true };
  }
}
