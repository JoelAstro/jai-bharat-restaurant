import prisma from '../config/prisma.js';

export class CouponService {
  static async validateCoupon(code: string, subtotalPaise: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon) {
      throw new Error(`Coupon "${code}" is invalid.`);
    }

    if (!coupon.isActive) {
      throw new Error(`Coupon "${code}" is currently inactive.`);
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      throw new Error(`Coupon "${code}" has expired.`);
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      throw new Error(`Coupon "${code}" usage limit has been reached.`);
    }

    if (subtotalPaise < coupon.minOrderAmount) {
      const minAmountRupees = (coupon.minOrderAmount / 100).toFixed(0);
      throw new Error(`Coupon requires a minimum order value of ₹${minAmountRupees}.`);
    }

    // Calculate discount
    let discountPaise = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountPaise = Math.round((subtotalPaise * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountPaise > coupon.maxDiscount) {
        discountPaise = coupon.maxDiscount;
      }
    } else {
      // FIXED
      discountPaise = Math.min(coupon.discountValue, subtotalPaise);
    }

    return {
      coupon,
      discountPaise,
    };
  }

  static async getAllCoupons() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getActivePublicCoupons() {
    return prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: {
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        minOrderAmount: true,
        maxDiscount: true,
      },
    });
  }

  static async createCoupon(data: {
    code: string;
    description?: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    expiresAt?: Date | null;
    usageLimit?: number | null;
    isActive?: boolean;
  }) {
    return prisma.coupon.create({
      data: {
        code: data.code.trim().toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount ?? 0,
        maxDiscount: data.maxDiscount,
        expiresAt: data.expiresAt,
        usageLimit: data.usageLimit,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateCoupon(
    id: string,
    data: {
      description?: string;
      discountType?: 'PERCENTAGE' | 'FIXED';
      discountValue?: number;
      minOrderAmount?: number;
      maxDiscount?: number;
      expiresAt?: Date | null;
      usageLimit?: number | null;
      isActive?: boolean;
    }
  ) {
    return prisma.coupon.update({
      where: { id },
      data,
    });
  }

  static async deleteCoupon(id: string) {
    return prisma.coupon.delete({
      where: { id },
    });
  }
}
