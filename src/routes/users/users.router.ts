import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.middleware';
import { userController } from './user.controller';

export const userRouter = Router();

// /users/register
userRouter.post('/register', userController.registerUser);

// /users/login
userRouter.post('/login', userController.loginUser);

// /users/verify
userRouter.get('/verify', authenticate, userController.verifyUser);

// /users/check-email

// /users/check-username

// /users/:id
// delete user as admin or self
