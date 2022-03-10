import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { ROLES } from '../../types/roles';
import { appController } from './apps.controller';

export const appRouter = Router();

// /app/register
appRouter.post('/register', appController.createOne);

// /app/:id
appRouter
  .route('/:id')
  .get(appController.findOne)
  .put(authenticate, authorize([ROLES.ADMIN]), appController.updateOne)
  .delete(authenticate, authorize([ROLES.ADMIN]), appController.deleteOne);
