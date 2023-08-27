import { hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { CONFIG } from '../../config/app.config';
import { CustomErrors } from '../../errors';
import { App, IApp } from '../../models/App';
import { User } from '../../models/User';
import { ROLES } from '../../types/roles';
import { STATUS_CODES } from '../../types/status-codes';
import { crudController } from '../../utils/crud.util';
import CryptoJS from 'crypto-js';
import { AppSecret } from '../../models/AppSecret';

const createOneApp =
  (app: Model<IApp>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, password, jwt_secret = CONFIG.JWT_SECRET } = req.body;
      let adminUsername = `${name}-${ROLES.ADMIN}`;

      if (!name) {
        return next(new CustomErrors.BadRequestError('name required'));
      }

      // TODO:
      // use mongoose transaction
      const appDoc = await app.create({
        ...req.body
      });

      const encryptedSecret = CryptoJS.AES.encrypt(
        jwt_secret,
        CONFIG.ENCRYPTION_KEY
      ).toString();
      const appSecret = await AppSecret.create({
        jwt_secret: encryptedSecret,
        app_id: appDoc.toJSON()._id
      });

      // generate default admin with unique username for the app
      const passwordHash = await hash(password || adminUsername, 10);

      const user = await User.create({
        username: adminUsername,
        password: passwordHash,
        allowed_roles: [ROLES.ADMIN],
        default_role: ROLES.ADMIN,
        app_id: appDoc.toJSON()._id
      });

      // res.status(STATUS_CODES.CREATED).json({ app: doc });
      res.status(STATUS_CODES.CREATED).json({ app: appDoc, adminUser: user });
    } catch (err) {
      console.error(err);
      res.status(STATUS_CODES.BAD_REQUEST).json(err).end();
    }
  };

const deleteOneApp =
  (app: Model<IApp>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { name } = req.body;

      // TODO:
      // use mongoose transaction
      if (!name) {
        return next(
          new CustomErrors.BadRequestError('name required as confirmation')
        );
      }

      const appDoc = await app
        .findOne({
          _id: id,
          name: name
        })
        .exec();

      if (!appDoc) {
        return next(new CustomErrors.NotFoundError(App.modelName));
      }

      console.log(`deleting app: ${id} - ${name}`);
      const { deletedCount: deletedAppCount = 0 } = await app.deleteOne({
        _id: id
      });

      if (deletedAppCount === 0) {
        return next(new CustomErrors.NotFoundError(App.modelName));
      }

      // verify if user is an admin for this app
      if (res.locals.USER.app_id !== id) {
        return next(
          new CustomErrors.ForbiddenError('You are not an admin for this app')
        );
      }

      console.log(`deleting app secret: ${id} - ${name}`);

      // delete app secret
      const { deletedCount: deletedAppSecretCount = 0 } =
        await AppSecret.deleteOne({
          app_id: id
        });
      if (deletedAppSecretCount === 0) {
        return next(new CustomErrors.NotFoundError(AppSecret.modelName));
      }

      console.log(`deleting all users of app: ${id} - ${name}`);
      // delete all users with this app_id
      const { deletedCount = 0 } = await User.deleteMany({
        app_id: id
      });
      if (deletedCount === 0) {
        return next(new CustomErrors.NotFoundError(User.modelName));
      }

      res.status(STATUS_CODES.NO_CONTENT).json({ app: appDoc });
    } catch (err) {
      console.error(err);
      res.status(STATUS_CODES.BAD_REQUEST).json(err).end();
    }
  };

export const appController = {
  ...crudController(App),
  createOne: createOneApp(App),
  deleteOne: deleteOneApp(App)
};
