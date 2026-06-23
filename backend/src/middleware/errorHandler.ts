import { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
}
