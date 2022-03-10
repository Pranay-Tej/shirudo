import { NextFunction, Request, Response } from 'express';
import { CustomErrors } from '../errors';

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return next(new CustomErrors.NotFoundError('Route'));
};
