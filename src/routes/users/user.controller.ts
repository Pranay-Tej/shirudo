import { compare, hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { CONFIG } from '../../config/app.config';
import { CustomErrors } from '../../errors';
import { User } from '../../models/User';
import { HASURA_HEADERS } from '../../types/hasura-headers';
import { ROLES } from '../../types/roles';
import { STATUS_CODES } from '../../types/status-codes';
import { newToken } from '../../utils/auth.util';

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { email, ...requestBody } = req.body;
    if (email) {
      requestBody = { ...requestBody, email };
    }

    const {
      username,
      password,
      app_id,
      default_role = ROLES.USER,
      allowed_roles = [ROLES.USER]
    } = requestBody;
    if (!username || !password) {
      return next(
        new CustomErrors.BadRequestError('Username and password required')
      );
    }
    if (!app_id) {
      return next(
        new CustomErrors.BadRequestError(
          'app_id required. Please register an app at /apps/register to continue.'
        )
      );
    }
    if (default_role === ROLES.ADMIN || allowed_roles.includes(ROLES.ADMIN)) {
      return next(
        new CustomErrors.ForbiddenError(
          'default_role and allowed_roles cannot contain admin'
        )
      );
    }
    const passwordHash = await hash(password, 10);
    const user = await User.create({
      ...requestBody,
      password: passwordHash,
      default_role,
      allowed_roles
    });

    // token
    const token: any = {
      user_id: user._id,
      username: user.username,
      default_role: user.default_role,
      allowed_roles: user.allowed_roles
    };

    // hasura claims config
    if (CONFIG.IS_HASURA_MODE_ENABLED) {
      const namespace = HASURA_HEADERS.HASURA_NAMESPACE;
      token[namespace] = {};
      token[namespace][HASURA_HEADERS.HASURA_ALLOWED_ROLES] =
        user.allowed_roles;
      token[namespace][HASURA_HEADERS.HASURA_DEFAULT_ROLE] = user.default_role;
      token[namespace][HASURA_HEADERS.HASURA_USER_ID] = user._id;
    }

    res.status(STATUS_CODES.CREATED).json({ jwt: newToken(token) });
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.BAD_REQUEST).json(err).end();
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identity, password, app_id } = req.body;
    if (!identity || !password || !app_id) {
      return next(
        new CustomErrors.BadRequestError(
          'username/email, password and app_id required'
        )
      );
    }
    const user = await User.findOne({
      app_id,
      $or: [{ email: identity }, { username: identity }]
    })
      .lean()
      .exec();

    if (!user) {
      return next(new CustomErrors.UnauthenticatedError());
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return next(new CustomErrors.UnauthenticatedError());
    }

    // token
    const token: any = {
      user_id: user._id,
      username: user.username,
      default_role: user.default_role,
      allowed_roles: user.allowed_roles
    };

    // hasura claims config
    if (CONFIG.IS_HASURA_MODE_ENABLED) {
      const namespace = HASURA_HEADERS.HASURA_NAMESPACE;
      token[namespace] = {};
      token[namespace][HASURA_HEADERS.HASURA_ALLOWED_ROLES] =
        user.allowed_roles;
      token[namespace][HASURA_HEADERS.HASURA_DEFAULT_ROLE] = user.default_role;
      token[namespace][HASURA_HEADERS.HASURA_USER_ID] = user._id;
    }

    res.status(STATUS_CODES.OK).json({ jwt: newToken(token) });
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.UNAUTHORIZED).json(err).end();
  }
};

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(STATUS_CODES.OK).json({
      user: res.locals.USER
    });
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.UNAUTHORIZED).json(err).end();
  }
};

export const userController = {
  registerUser,
  loginUser,
  verifyUser
};
