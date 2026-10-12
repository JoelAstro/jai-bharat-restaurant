import { Request, Response } from 'express';
import { MenuService } from '../services/menu.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class MenuController {
  // Categories
  static async getCategories(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const categories = await MenuService.getCategories(includeInactive);
      return sendSuccess(res, categories);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const category = await MenuService.createCategory(req.body);
      return sendSuccess(res, category, 'Category created', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const category = await MenuService.updateCategory(req.params.id, req.body);
      return sendSuccess(res, category, 'Category updated');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    try {
      await MenuService.deleteCategory(req.params.id);
      return sendSuccess(res, null, 'Category deleted');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  // Menu Items
  static async getMenuItems(req: Request, res: Response) {
    try {
      const { categoryId, categorySlug, search, isVeg, isFeatured, isAvailable, isAdmin } =
        req.query;

      const items = await MenuService.getMenuItems({
        categoryId: categoryId as string,
        categorySlug: categorySlug as string,
        search: search as string,
        isVeg: isVeg !== undefined ? isVeg === 'true' : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
        isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
        isAdmin: isAdmin === 'true',
      });

      return sendSuccess(res, items);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async getMenuItemById(req: Request, res: Response) {
    try {
      const item = await MenuService.getMenuItemById(req.params.id);
      return sendSuccess(res, item);
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  static async createMenuItem(req: Request, res: Response) {
    try {
      const item = await MenuService.createMenuItem(req.body);
      return sendSuccess(res, item, 'Menu item created', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateMenuItem(req: Request, res: Response) {
    try {
      const item = await MenuService.updateMenuItem(req.params.id, req.body);
      return sendSuccess(res, item, 'Menu item updated');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async toggleAvailability(req: Request, res: Response) {
    try {
      const item = await MenuService.toggleAvailability(req.params.id);
      return sendSuccess(res, item, 'Item availability toggled');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async deleteMenuItem(req: Request, res: Response) {
    try {
      await MenuService.deleteMenuItem(req.params.id);
      return sendSuccess(res, null, 'Menu item deleted');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
