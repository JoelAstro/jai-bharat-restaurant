import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import prisma from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class FavoriteController {
  static async getFavorites(req: AuthenticatedRequest, res: Response) {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: req.user!.userId },
        include: {
          menuItem: {
            include: {
              category: true,
              variations: true,
              addons: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return sendSuccess(res, favorites);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  static async toggleFavorite(req: AuthenticatedRequest, res: Response) {
    try {
      const { menuItemId } = req.body;
      if (!menuItemId) {
        return sendError(res, 'menuItemId is required', 400);
      }

      const existing = await prisma.favorite.findUnique({
        where: {
          userId_menuItemId: {
            userId: req.user!.userId,
            menuItemId,
          },
        },
      });

      if (existing) {
        await prisma.favorite.delete({
          where: { id: existing.id },
        });
        return sendSuccess(res, { isFavorite: false }, 'Removed from favorites');
      } else {
        await prisma.favorite.create({
          data: {
            userId: req.user!.userId,
            menuItemId,
          },
        });
        return sendSuccess(res, { isFavorite: true }, 'Added to favorites');
      }
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
