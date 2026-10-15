import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadSingleImage } from '../middlewares/upload.middleware.js';
import { uploadImage, deleteImage } from '../controllers/upload.controller.js';
import { sendError } from '../utils/response.js';

const router = Router();

const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadSingleImage(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'File size exceeds limit of 5MB.', 413);
      }
      return sendError(res, err.message, 400);
    } else if (err instanceof Error) {
      return sendError(res, err.message, 400);
    }
    next();
  });
};

// POST /api/upload - Upload an image to Cloudinary
router.post('/', handleUpload, uploadImage);

// DELETE /api/upload/:publicId - Delete an image from Cloudinary
router.delete('/:publicId', deleteImage);
router.delete('/', deleteImage);

export default router;
