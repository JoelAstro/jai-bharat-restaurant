import { Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class OrderController {
  static async calculateCart(req: AuthenticatedRequest, res: Response) {
    try {
      const { items, couponCode, orderType } = req.body;
      const calculation = await OrderService.calculateCart(items, couponCode, orderType);
      return sendSuccess(res, calculation);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const order = await OrderService.createOrder({
        userId: req.user!.userId,
        ...req.body,
      });
      return sendSuccess(res, order, 'Order created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getCustomerOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = await OrderService.getCustomerOrders(req.user!.userId);
      return sendSuccess(res, orders);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const isAdmin = req.user?.role === 'ADMIN';
      const order = await OrderService.getOrderById(
        req.params.id,
        req.user?.userId,
        isAdmin
      );
      return sendSuccess(res, order);
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  static async getAdminOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const { status, paymentStatus, orderType, search, limit, offset } = req.query;
      const result = await OrderService.getAdminOrders({
        status: status as string,
        paymentStatus: paymentStatus as string,
        orderType: orderType as string,
        search: search as string,
        limit: limit ? parseInt(limit as string, 10) : 50,
        offset: offset ? parseInt(offset as string, 10) : 0,
      });
      return sendSuccess(res, result);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { status, note } = req.body;
      const order = await OrderService.updateOrderStatus(req.params.id, status, note);
      return sendSuccess(res, order, `Order status updated to ${status}`);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updatePaymentStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { paymentStatus } = req.body;
      const order = await OrderService.updatePaymentStatus(req.params.id, paymentStatus);
      return sendSuccess(res, order, 'Payment status updated');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
