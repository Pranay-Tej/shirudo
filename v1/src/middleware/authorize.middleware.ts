import { NextFunction, Request, Response } from 'express';
import { CustomErrors } from '../errors';
import { ROLES } from '../types/roles';

export const authorize = (requiredRoles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (
      res.locals.USER.role === ROLES.ADMIN ||
      requiredRoles.includes(res.locals.USER.role)
    ) {
      return next();
    }
    return next(new CustomErrors.ForbiddenError());
  };
};
