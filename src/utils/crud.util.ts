import { Model } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../types/status-codes';
import { CustomErrors } from '../errors';

const count = (model: Model<any>) => async (req: Request, res: Response) => {
  try {
    const { ...filters } = req.query;
    const count = await model.countDocuments({ ...filters });
    // console.log(count);
    res.status(STATUS_CODES.OK).json({ count });
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.BAD_REQUEST).json(err).end();
  }
};

const findOne =
  (model: Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await model
        .findOne({
          _id: req.params.id
        })
        .lean()
        .exec();
      if (!doc) {
        return next(new CustomErrors.NotFoundError(model.modelName));
      }

      res.status(STATUS_CODES.OK).json(doc);
    } catch (err) {
      console.error(err);
      res.status(STATUS_CODES.BAD_REQUEST).json(err).end();
    }
  };

const findMany = (model: Model<any>) => async (req: Request, res: Response) => {
  const {
    _sort = 'updatedAt',
    _order = -1,
    _page = 0,
    _limit = 100,
    ...filters
  } = req.query;
  try {
    let sortCriteria = {} as any;
    sortCriteria[_sort as string] = _order;
    const limit = _limit != '-1' ? parseInt(_limit as string) : NaN;
    // console.log(sortCriteria);
    // console.log(limit);
    const docs = await model
      .find({
        ...filters
      })
      .sort({ ...sortCriteria })
      .limit(limit)
      .skip(parseInt(_page as string) * limit)
      .lean()
      .exec();

    res.status(STATUS_CODES.OK).json(docs);
  } catch (err) {
    console.error(err);
    res.status(STATUS_CODES.BAD_REQUEST).json(err).end();
  }
};

const createOne =
  (model: Model<any>) => async (req: Request, res: Response) => {
    try {
      const doc = await model.create({
        ...req.body
      });
      res.status(STATUS_CODES.CREATED).json(doc);
    } catch (err) {
      console.error(err);
      res.status(STATUS_CODES.BAD_REQUEST).json(err).end();
    }
  };

const updateOne =
  (model: Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedDoc = await model
        .findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          upsert: true
        })
        .lean()
        .exec();

      if (!updatedDoc) {
        return next(new CustomErrors.BadRequestError());
      }

      res.status(STATUS_CODES.OK).json(updatedDoc);
    } catch (err) {
      console.error(err);
      res.status(STATUS_CODES.BAD_REQUEST).json(err).end();
    }
  };

const deleteOne =
  (model: Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const removed = await model.findByIdAndDelete(req.params.id);
      const { deletedCount = 0 } = await model.deleteOne({
        _id: req.params.id
      });
      // console.log(deletedCount);
      if (deletedCount === 0) {
        return next(new CustomErrors.NotFoundError(model.modelName));
      }

      res.status(STATUS_CODES.NO_CONTENT).end();
    } catch (err) {
      console.error(err);
      res.status(STATUS_CODES.BAD_REQUEST).json(err).end();
    }
  };

export const crudController = (model: Model<any>) => ({
  count: count(model),
  findOne: findOne(model),
  findMany: findMany(model),
  createOne: createOne(model),
  updateOne: updateOne(model),
  deleteOne: deleteOne(model)
});
