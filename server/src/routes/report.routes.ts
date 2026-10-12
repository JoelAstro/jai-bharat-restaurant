import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Admin-only reports & CSV export
router.get('/overview', requireAuth, requireAdmin, ReportController.getOverview);
router.get('/sales', requireAuth, requireAdmin, ReportController.getSalesReport);
router.get('/export-csv', requireAuth, requireAdmin, ReportController.exportCSV);

export default router;
