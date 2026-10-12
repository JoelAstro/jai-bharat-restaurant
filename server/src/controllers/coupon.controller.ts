import { Request, Response } from 'express';
import { CouponService } from '../services/coupon.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class CouponController {
  static async validate(req: Request, res: Response) {
    try {
      const { code, subtotalPaise } = req.body;
      if (!code || subtotalPaise === undefined) {
        return sendError(res, 'Code and subtotalPaise are required', 400);
      }
      const result = await CouponService.validateCoupon(code, subtotalPaise);
      return sendSuccess(res, result, 'Coupon applied successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getPublicCoupons(_req: Request, res: Response) {
    try {
      const coupons = await CouponService.getActivePublicCoupons();
      return sendSuccess(res, coupons);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getAdminCoupons(_req: Request, res: Response) {
    try {
      const coupons = await CouponService.getAllCoupons();
      return sendSuccess(res, coupons);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async createCoupon(req: Request, res: Response) {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      return sendSuccess(res, coupon, 'Coupon created', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateCoupon(req: Request, res: Response) {
    try {
      const coupon = await CouponService.updateCoupon(req.params.id, req.body);
      return sendSuccess(res, coupon, 'Coupon updated');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async deleteCoupon(req: Request, res: Response) {
    try {
      await CouponService.deleteCoupon(req.params.id);
      return sendSuccess(res, null, 'Coupon deleted');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
