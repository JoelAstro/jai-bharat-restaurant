import { Request, Response } from 'express';
import { ReportService } from '../services/report.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class ReportController {
  static async getOverview(_req: Request, res: Response) {
    try {
      const overview = await ReportService.getOverviewMetrics();
      return sendSuccess(res, overview);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getSalesReport(req: Request, res: Response) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const report = await ReportService.getSalesReport(days);
      return sendSuccess(res, report);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async exportCSV(req: Request, res: Response) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const csv = await ReportService.exportOrdersCSV(days);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=jai-bharat-orders-${new Date().toISOString().slice(0, 10)}.csv`
      );
      return res.status(200).send(csv);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }
}
