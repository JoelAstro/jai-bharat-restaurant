import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ImageController } from '../controllers/image.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Ensure upload directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads', 'images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanBase || 'img'}-${uniqueSuffix}${ext}`);
  },
});

// Multer file filter for jpg, jpeg, png, webp
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image format. Only JPG, JPEG, PNG, and WebP are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

// Public endpoints
router.get('/public', ImageController.getPublicImages);

// Admin-only protected endpoints
router.get('/', requireAuth, requireAdmin, ImageController.getAllImages);
router.post(
  '/upload',
  requireAuth,
  requireAdmin,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
        });
      }
      next();
    });
  },
  ImageController.uploadImage
);
router.post('/', requireAuth, requireAdmin, ImageController.createImage);
router.put('/reorder', requireAuth, requireAdmin, ImageController.reorderImages);
router.put('/:id/default', requireAuth, requireAdmin, ImageController.setDefaultImage);
router.put('/:id', requireAuth, requireAdmin, ImageController.updateImage);
router.delete('/:id', requireAuth, requireAdmin, ImageController.deleteImage);

export default router;
