import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { ENV } from './config/env.js';

export const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      const cleanClientUrl = (ENV.CLIENT_URL || '').replace(/\/$/, '');
      if (
        cleanOrigin === cleanClientUrl ||
        cleanOrigin === 'http://localhost:5173' ||
        cleanOrigin === 'http://127.0.0.1:5173' ||
        cleanOrigin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body parsing with raw buffer preservation for Razorpay webhook verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// Rate limiting on sensitive auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 login/register requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Jai Bharat Family Restaurant API',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular API routes
app.use('/api', apiRouter);

// In production, serve frontend client if client/dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // 404 Handler for API-only deployment
  app.use('*', (_req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found',
    });
  });
}

// Centralized error handler
app.use(errorHandler);

export default app;
