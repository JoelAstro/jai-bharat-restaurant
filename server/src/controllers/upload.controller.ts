import { Request, Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string = 'jai_bharat_uploads'
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed.'));
        }
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export async function uploadImage(req: Request, res: Response): Promise<any> {
  if (!isCloudinaryConfigured()) {
    return sendError(
      res,
      'Cloudinary is not configured. Please supply CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.',
      503
    );
  }

  const file = req.file;
  if (!file) {
    return sendError(res, 'No file uploaded. Please supply an image under the "image" field.', 400);
  }

  const folder = (req.body.folder as string) || 'jai_bharat_uploads';

  try {
    const result = await uploadBufferToCloudinary(file.buffer, folder);

    return sendSuccess(
      res,
      {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
      'Image uploaded to Cloudinary successfully',
      201
    );
  } catch (error: any) {
    console.error('[Upload Error]:', error);
    return sendError(res, error.message || 'Failed to upload image to Cloudinary.', 500);
  }
}

export async function deleteImage(req: Request, res: Response): Promise<any> {
  if (!isCloudinaryConfigured()) {
    return sendError(res, 'Cloudinary is not configured.', 503);
  }

  const publicId = (req.params.publicId || req.body.public_id) as string;
  if (!publicId) {
    return sendError(res, 'Missing public_id parameter.', 400);
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });

    if (result.result === 'ok') {
      return sendSuccess(res, { public_id: publicId }, 'Image removed successfully');
    } else {
      return sendError(res, `Failed to delete image: ${result.result}`, 400);
    }
  } catch (error: any) {
    console.error('[Delete Image Error]:', error);
    return sendError(res, error.message || 'Failed to delete image.', 500);
  }
}

export async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured() || !publicId) {
    return false;
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error(`[Cloudinary Destroy Error] Failed to destroy ${publicId}:`, error);
    return false;
  }
}

