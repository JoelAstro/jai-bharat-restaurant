import { Request, Response } from 'express';
import { ImageService } from '../services/image.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class ImageController {
  static async getPublicImages(req: Request, res: Response) {
    try {
      const section = req.query.section as string | undefined;
      const images = await ImageService.getPublicImages(section);
      return sendSuccess(res, images);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch public images', 500);
    }
  }

  static async getAllImages(req: Request, res: Response) {
    try {
      const section = req.query.section as string | undefined;
      const images = await ImageService.getAllImages(section);
      return sendSuccess(res, images);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch website images', 500);
    }
  }

  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return sendError(res, 'No image file uploaded or invalid file format.', 400);
      }

      // Consistent relative URL path
      const imageUrl = `/uploads/images/${req.file.filename}`;
      return sendSuccess(res, { imageUrl, filename: req.file.filename }, 'Image uploaded successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to upload image', 500);
    }
  }

  static async createImage(req: Request, res: Response) {
    try {
      const { section, title, imageUrl, altText, displayOrder, isDefault, isEnabled, metadata } = req.body;
      if (!section || !title || !imageUrl) {
        return sendError(res, 'Section, title, and imageUrl are required fields.', 400);
      }

      const image = await ImageService.createImage({
        section,
        title,
        imageUrl,
        altText,
        displayOrder,
        isDefault,
        isEnabled,
        metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata,
      });

      return sendSuccess(res, image, 'Image created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create image', 400);
    }
  }

  static async updateImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, imageUrl, altText, displayOrder, isDefault, isEnabled, metadata } = req.body;

      const updated = await ImageService.updateImage(id, {
        ...(title !== undefined ? { title } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(altText !== undefined ? { altText } : {}),
        ...(displayOrder !== undefined ? { displayOrder: Number(displayOrder) } : {}),
        ...(isDefault !== undefined ? { isDefault: Boolean(isDefault) } : {}),
        ...(isEnabled !== undefined ? { isEnabled: Boolean(isEnabled) } : {}),
        ...(metadata !== undefined ? { metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata } : {}),
      });

      return sendSuccess(res, updated, 'Image updated successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update image', 400);
    }
  }

  static async setDefaultImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await ImageService.setDefaultImage(id);
      return sendSuccess(res, updated, 'Default image updated successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to set default image', 400);
    }
  }

  static async reorderImages(req: Request, res: Response) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return sendError(res, 'Items array is required for reordering', 400);
      }

      await ImageService.reorderImages(items);
      return sendSuccess(res, null, 'Images reordered successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to reorder images', 400);
    }
  }

  static async deleteImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ImageService.deleteImage(id);
      return sendSuccess(res, null, 'Image deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to delete image', 400);
    }
  }
}
