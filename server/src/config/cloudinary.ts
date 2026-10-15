import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    ENV.CLOUDINARY_CLOUD_NAME &&
    ENV.CLOUDINARY_API_KEY &&
    ENV.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log(`[Cloudinary] Configured for cloud: ${ENV.CLOUDINARY_CLOUD_NAME}`);
} else {
  console.warn(
    '[Cloudinary] Warning: Cloudinary credentials not fully configured in environment. File uploads will be disabled until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are provided.'
  );
}

export async function verifyCloudinaryConnection(): Promise<boolean> {
  if (!isCloudinaryConfigured()) {
    return false;
  }
  try {
    const res = await cloudinary.api.ping();
    if (res.status === 'ok') {
      console.log('[Cloudinary] Ping verified successfully.');
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('[Cloudinary] Connection verification failed:', error?.message || error);
    return false;
  }
}

export default cloudinary;
