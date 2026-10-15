import app from './app.js';
import { ENV } from './config/env.js';
import { ensureAdminAccount } from './config/initAdmin.js';
import { verifyCloudinaryConnection } from './config/cloudinary.js';

// Ensure the configured administrator account is initialized in the database
ensureAdminAccount().catch((err) => {
  console.error('Failed to initialize administrator account:', err);
});

// Run startup verification for Cloudinary if configured
verifyCloudinaryConnection().catch((err) => {
  console.warn('[Cloudinary Startup Check Warning]:', err?.message || err);
});

const server = app.listen(ENV.PORT, () => {
  console.log(`====================================================`);
  console.log(`  Jai Bharat Family Restaurant API Server`);
  console.log(`  Running on http://localhost:${ENV.PORT}`);
  console.log(`  Environment: ${ENV.NODE_ENV}`);
  console.log(`====================================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
