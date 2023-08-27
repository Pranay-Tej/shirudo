import { NextFunction, Request, Response } from 'express';
import { CustomApiError } from '../errors/custom-api.error';
import { STATUS_CODES } from '../types/status-codes';

export const errorHandlerMiddleware = (
  err: CustomApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Error middleware....');

  console.error(err);
  const customError = {
    // set default
    statusCode: err?.statusCode ?? STATUS_CODES.INTERNAL_SERVER_ERROR,
    message: err?.message ?? 'Internal Server Error',
    name: err?.name ?? 'Internal Server Error'
  };

  return res.status(customError.statusCode).json(customError).end();
};
