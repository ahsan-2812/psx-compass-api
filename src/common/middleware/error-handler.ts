import type { ErrorRequestHandler } from 'express';

import type { AppLogger } from '../../config/logger.js';
import { AppError } from '../errors/app-error.js';

export function createErrorHandler(logger: AppLogger): ErrorRequestHandler {
  return (error: unknown, _request, response, next) => {
    void next;
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });
      return;
    }

    logger.error({ err: error }, 'Unhandled request error');
    response.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
      },
    });
  };
}
