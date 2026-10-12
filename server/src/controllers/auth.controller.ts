import { Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, result, 'Account registered successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      return sendSuccess(res, result, 'Logged in successfully');
    } catch (err: any) {
      return sendError(res, err.message, 401);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await AuthService.getProfile(req.user!.userId);
      return sendSuccess(res, user);
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await AuthService.updateProfile(req.user!.userId, req.body);
      return sendSuccess(res, user, 'Profile updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getAddresses(req: AuthenticatedRequest, res: Response) {
    try {
      const addresses = await AuthService.getAddresses(req.user!.userId);
      return sendSuccess(res, addresses);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async addAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const address = await AuthService.addAddress(req.user!.userId, req.body);
      return sendSuccess(res, address, 'Address added successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateAddress(req: AuthenticatedRequest, res: Response) {
    try {
      const address = await AuthService.updateAddress(
        req.user!.userId,
        req.params.id,
        req.body
      );
      return sendSuccess(res, address, 'Address updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async deleteAddress(req: AuthenticatedRequest, res: Response) {
    try {
      await AuthService.deleteAddress(req.user!.userId, req.params.id);
      return sendSuccess(res, null, 'Address deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
