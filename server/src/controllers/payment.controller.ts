import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class PaymentController {
  static async createPaymentOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return sendError(res, 'Order ID is required', 400);
      }
      const paymentOrder = await PaymentService.createPaymentOrder(
        orderId,
        req.user!.userId
      );
      return sendSuccess(res, paymentOrder, 'Payment order created');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async verifyPayment(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      const result = await PaymentService.verifyPayment({
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        userId: req.user!.userId,
      });
      return sendSuccess(res, result, 'Payment verified successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      const result = await PaymentService.handleWebhook(rawBody, signature);
      return sendSuccess(res, result, 'Webhook handled');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
