import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Avoid logging private details or credentials
  console.error('Unhandled Server Error:', err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error. Please try again later.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(ENV.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details,
    }),
  });
}
