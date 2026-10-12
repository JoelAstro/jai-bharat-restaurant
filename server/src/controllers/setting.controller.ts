import { Request, Response } from 'express';
import { SettingService } from '../services/setting.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class SettingController {
  static async getPublicSettings(_req: Request, res: Response) {
    try {
      const settings = await SettingService.getPublicSettings();
      return sendSuccess(res, settings);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getAdminSettings(_req: Request, res: Response) {
    try {
      const result = await SettingService.getAdminSettings();
      return sendSuccess(res, result);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async updateSettings(req: Request, res: Response) {
    try {
      const updated = await SettingService.updateSettings(req.body);
      return sendSuccess(res, updated, 'Settings updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
