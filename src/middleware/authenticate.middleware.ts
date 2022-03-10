import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { CONFIG } from '../config/app.config';
import { CustomErrors } from '../errors';
import { User } from '../models/User';
import { SHIRUDO_HEADERS } from '../types/shirudo-headers';
import { STATUS_CODES } from '../types/status-codes';

// allow app to verify jwt and return userInfo
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('checking user authentication...');

    const bearerToken: string = req.header('Authorization') as string;

    if (!bearerToken) {
      return next(new CustomErrors.UnauthenticatedError());
    }

    const token = bearerToken.split('Bearer ')[1];

    if (!token) {
      return next(new CustomErrors.UnauthenticatedError());
    }

    const decoded: any = verify(token, CONFIG.JWT_SECRET);

    const user = await User.findOne(
      { _id: decoded.user_id },
      { password: 0, email: 0, createdAt: 0, updatedAt: 0 }
    )
      .lean()
      .exec();

    // if user is not registered in the system, return error
    if (!user) {
      return next(new CustomErrors.UnauthenticatedError());
    }

    // if role claimed in headers is not present in allowed roles, return error
    const claimedRole = req.header(SHIRUDO_HEADERS.SHIRUDO_ROLE) as string;
    if (claimedRole && !user.allowed_roles.includes(claimedRole)) {
      return next(
        new CustomErrors.ForbiddenError(`You do have have ${claimedRole} role`)
      );
    }

    // add user info to res.locals
    res.locals.USER = {
      ...user,
      _id: user._id.toString(),
      app_id: user.app_id.toString()
    };

    // override user role if role is set in header
    res.locals.USER.role = claimedRole ?? user.default_role;

    next();
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.UNAUTHORIZED).json(err).end();
  }
};
