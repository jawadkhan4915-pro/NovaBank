import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ApiResponse } from '@novabank/shared';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    return res.status(err.statusCode).json(response);
  }

  console.error('[Unhandled Error]:', err);
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal error occurred',
    },
  };
  return res.status(500).json(response);
};
