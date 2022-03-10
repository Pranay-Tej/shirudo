import { hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { CustomErrors } from '../../errors';
import { App, IApp } from '../../models/App';
import { User } from '../../models/User';
import { ROLES } from '../../types/roles';
import { STATUS_CODES } from '../../types/status-codes';
import { crudController } from '../../utils/crud.util';

const createOneApp =
  (app: Model<IApp>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, password = ROLES.ADMIN } = req.body;

      if (!name) {
        return next(new CustomErrors.BadRequestError('name required'));
      }

      // TODO:
      // use mongoose transaction
      const doc = await app.create({
        ...req.body
      });

      // generate default admin with unique username for the app
      const passwordHash = await hash(password, 10);

      const user = await User.create({
        username: `admin-${doc.name}`,
        password: passwordHash,
        allowed_roles: [ROLES.ADMIN],
        default_role: ROLES.ADMIN,
        app_id: doc.toJSON()._id
      });

      // res.status(STATUS_CODES.CREATED).json({ app: doc });
      res.status(STATUS_CODES.CREATED).json({ app: doc, adminUser: user });
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

      const doc = await app
        .findOne({
          _id: id,
          name: name
        })
        .exec();

      if (!doc) {
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

      console.log(`deleting all users of app: ${id} - ${name}`);

      // delete all users with this app_id
      const { deletedCount = 0 } = await User.deleteMany({
        app_id: id
      });
      if (deletedCount === 0) {
        return next(new CustomErrors.NotFoundError(User.modelName));
      }

      res.status(STATUS_CODES.NO_CONTENT).json({ app: doc });
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
