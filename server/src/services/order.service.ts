import prisma from '../config/prisma.js';
import { CouponService } from './coupon.service.js';
import { SettingService } from './setting.service.js';

export interface CartItemInput {
  menuItemId: string;
  variationId?: string;
  addonIds?: string[];
  quantity: number;
}

export class OrderService {
  /**
   * Validate cart items, lookup real prices from DB, and calculate totals securely on backend.
   */
  static async calculateCart(items: CartItemInput[], couponCode?: string, orderType: 'DELIVERY' | 'TAKEAWAY' = 'DELIVERY') {
    if (!items || items.length === 0) {
      throw new Error('Cart is empty. Please select food items to order.');
    }

    let subtotalPaise = 0;
    const validatedItems = [];

    for (const itemInput of items) {
      if (itemInput.quantity <= 0) {
        throw new Error('Item quantity must be at least 1.');
      }

      const menuItem = await prisma.menuItem.findUnique({
        where: { id: itemInput.menuItemId },
        include: {
          variations: true,
          addons: true,
        },
      });

      if (!menuItem) {
        throw new Error(`Menu item with ID "${itemInput.menuItemId}" was not found.`);
      }

      if (!menuItem.isAvailable) {
        throw new Error(`"${menuItem.name}" is currently sold out or unavailable.`);
      }

      let unitPricePaise = menuItem.price;
      let selectedVariation = null;

      if (itemInput.variationId) {
        selectedVariation = menuItem.variations.find((v) => v.id === itemInput.variationId);
        if (!selectedVariation) {
          throw new Error(`Selected size/variation for "${menuItem.name}" is invalid.`);
        }
        unitPricePaise = selectedVariation.price;
      }

      const selectedAddons = [];
      let addonsTotalPaise = 0;

      if (itemInput.addonIds && itemInput.addonIds.length > 0) {
        for (const addonId of itemInput.addonIds) {
          const addon = menuItem.addons.find((a) => a.id === addonId);
          if (!addon) {
            throw new Error(`Selected add-on for "${menuItem.name}" is invalid.`);
          }
          selectedAddons.push(addon);
          addonsTotalPaise += addon.price;
        }
      }

      const itemTotalPaise = (unitPricePaise + addonsTotalPaise) * itemInput.quantity;
      subtotalPaise += itemTotalPaise;

      validatedItems.push({
        menuItem,
        selectedVariation,
        selectedAddons,
        unitPricePaise,
        addonsTotalPaise,
        quantity: itemInput.quantity,
        subtotalPaise: itemTotalPaise,
      });
    }

    // Get restaurant settings for taxes & delivery fees
    const settings = await SettingService.getPublicSettings();

    let deliveryFeePaise = 0;
    if (orderType === 'DELIVERY') {
      if (subtotalPaise >= settings.free_delivery_threshold_paise) {
        deliveryFeePaise = 0; // Free delivery
      } else {
        deliveryFeePaise = settings.delivery_fee_paise;
      }
    }

    // Coupon discount calculation
    let discountPaise = 0;
    let appliedCoupon = null;

    if (couponCode && couponCode.trim()) {
      const couponResult = await CouponService.validateCoupon(couponCode, subtotalPaise);
      discountPaise = couponResult.discountPaise;
      appliedCoupon = couponResult.coupon;
    }

    // Tax calculation (e.g. 5% GST on discounted subtotal)
    const taxableAmountPaise = Math.max(0, subtotalPaise - discountPaise);
    const taxPaise = Math.round((taxableAmountPaise * settings.tax_rate_percent) / 100);

    const totalPaise = taxableAmountPaise + taxPaise + deliveryFeePaise;

    return {
      items: validatedItems,
      subtotalPaise,
      deliveryFeePaise,
      taxPaise,
      discountPaise,
      totalPaise,
      appliedCoupon,
      orderType,
    };
  }

  /**
   * Create order in database inside a safe transaction
   */
  static async createOrder(data: {
    userId: string;
    items: CartItemInput[];
    orderType: 'DELIVERY' | 'TAKEAWAY';
    paymentMethod: 'RAZORPAY' | 'COD';
    couponCode?: string;
    specialInstructions?: string;
    addressId?: string;
    guestAddress?: {
      street: string;
      area?: string;
      city: string;
      pincode: string;
      landmark?: string;
    };
    customerName: string;
    customerPhone: string;
    customerEmail: string;
  }) {
    // 1. Calculate and validate entire cart
    const calculation = await this.calculateCart(data.items, data.couponCode, data.orderType);

    // 2. Validate delivery address if Delivery
    let addressSnapshot = null;
    if (data.orderType === 'DELIVERY') {
      if (data.addressId) {
        const address = await prisma.address.findFirst({
          where: { id: data.addressId, userId: data.userId },
        });
        if (!address) {
          throw new Error('Selected delivery address not found.');
        }
        addressSnapshot = JSON.stringify(address);
      } else if (data.guestAddress) {
        addressSnapshot = JSON.stringify(data.guestAddress);
      } else {
        throw new Error('Delivery address is required for home delivery orders.');
      }
    }

    // 3. Generate human-friendly sequential order number: JB-YYYYMMDD-XXXX
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `JB-${todayStr}-${randomSuffix}`;

    // 4. Execute atomic creation in transaction
    const order = await prisma.$transaction(async (tx) => {
      // If coupon used, increment timesUsed
      if (calculation.appliedCoupon) {
        await tx.coupon.update({
          where: { id: calculation.appliedCoupon.id },
          data: { timesUsed: { increment: 1 } },
        });
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: data.userId,
          orderType: data.orderType,
          status: 'PENDING',
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          subtotal: calculation.subtotalPaise,
          deliveryFee: calculation.deliveryFeePaise,
          tax: calculation.taxPaise,
          discount: calculation.discountPaise,
          total: calculation.totalPaise,
          couponCode: calculation.appliedCoupon?.code || null,
          specialInstructions: data.specialInstructions?.trim() || null,
          deliveryAddressSnapshot: addressSnapshot,
          customerName: data.customerName.trim(),
          customerPhone: data.customerPhone.trim(),
          customerEmail: data.customerEmail.toLowerCase().trim(),
          items: {
            create: calculation.items.map((val) => ({
              menuItemId: val.menuItem.id,
              itemName: val.menuItem.name,
              variationName: val.selectedVariation ? val.selectedVariation.name : null,
              priceSnapshot: val.unitPricePaise,
              quantity: val.quantity,
              subtotal: val.subtotalPaise,
              addons: {
                create: val.selectedAddons.map((a) => ({
                  addonName: a.name,
                  priceSnapshot: a.price,
                })),
              },
            })),
          },
          statusHistory: {
            create: {
              status: 'PENDING',
              note: `Order received via ${data.paymentMethod} payment.`,
            },
          },
        },
        include: {
          items: {
            include: { addons: true },
          },
          statusHistory: true,
        },
      });

      // Create notification for customer
      await tx.notification.create({
        data: {
          userId: data.userId,
          title: 'Order Placed Successfully!',
          message: `Your order #${orderNumber} for ₹${(calculation.totalPaise / 100).toFixed(0)} has been received.`,
        },
      });

      return newOrder;
    });

    return order;
  }

  /**
   * Get customer order history
   */
  static async getCustomerOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { addons: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single order by ID or orderNumber, with customer ownership check
   */
  static async getOrderById(orderIdOrNumber: string, userId?: string, isAdmin = false) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
      },
      include: {
        items: {
          include: { addons: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    if (!isAdmin && userId && order.userId !== userId) {
      throw new Error('Unauthorized access to order details.');
    }

    return order;
  }

  /**
   * Admin order list with filters & search
   */
  static async getAdminOrders(filters?: {
    status?: string;
    paymentStatus?: string;
    orderType?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const whereClause: any = {};

    if (filters?.status && filters.status !== 'ALL') {
      whereClause.status = filters.status;
    }

    if (filters?.paymentStatus && filters.paymentStatus !== 'ALL') {
      whereClause.paymentStatus = filters.paymentStatus;
    }

    if (filters?.orderType && filters.orderType !== 'ALL') {
      whereClause.orderType = filters.orderType;
    }

    if (filters?.search && filters.search.trim()) {
      whereClause.OR = [
        { orderNumber: { contains: filters.search.trim() } },
        { customerName: { contains: filters.search.trim() } },
        { customerPhone: { contains: filters.search.trim() } },
      ];
    }

    const [totalCount, orders] = await Promise.all([
      prisma.order.count({ where: whereClause }),
      prisma.order.findMany({
        where: whereClause,
        include: {
          items: {
            include: { addons: true },
          },
          statusHistory: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      }),
    ]);

    return { totalCount, orders };
  }

  /**
   * Update order status with valid transition check
   */
  static async updateOrderStatus(
    orderId: string,
    newStatus: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED',
    note?: string
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      throw new Error(`Cannot change status of an already ${order.status.toLowerCase()} order.`);
    }

    // Permitted status transitions
    const validTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['COMPLETED', 'CANCELLED'],
    };

    if (!validTransitions[order.status]?.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${order.status} to ${newStatus}.`
      );
    }

    return prisma.$transaction(async (tx) => {
      // If moving to COMPLETED and COD, record payment collected if needed
      let paymentStatus = order.paymentStatus;
      if (newStatus === 'COMPLETED' && order.paymentMethod === 'COD') {
        paymentStatus = 'PAID';
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          paymentStatus,
          statusHistory: {
            create: {
              status: newStatus,
              note: note || `Order status updated to ${newStatus}.`,
            },
          },
        },
        include: {
          statusHistory: true,
        },
      });

      // Customer notification
      await tx.notification.create({
        data: {
          userId: order.userId,
          title: `Order Status: ${newStatus}`,
          message: `Your order #${order.orderNumber} is now ${newStatus.toLowerCase()}. ${note || ''}`,
        },
      });

      return updated;
    });
  }

  /**
   * Admin toggle payment collection status (especially for COD)
   */
  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });
  }
}
