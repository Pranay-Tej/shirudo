import cors from 'cors';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { CONFIG } from './config/app.config';
import { errorHandlerMiddleware } from './middleware/error-handler.middleware';
import { notFoundMiddleware } from './middleware/route-not-found.middleware';
import { appRouter } from './routes/apps/apps.router';
import { userRouter } from './routes/users/users.router';

const app = express();

// Middleware libraries
const limit = rateLimit({
  max: 100, // max requests
  windowMs: 60 * 60 * 1000, // 1 Hour
  message: 'Too many requests, please try again later.' // message to send
});
app.use(limit); // Setting limiter on specific route
app.use(helmet());
app.use(cors());
// app.use(
//   cors({
//     origin: CONFIG.APPS
//   })
// );
app.use(express.json({ limit: '50kb' })); // Body limit is 50
app.use(morgan('dev'));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    who_dis: 'https://media.giphy.com/media/agmheddabICHK/giphy.gif'
  });
});

// Routers
app.use('/apps', appRouter);
app.use('/users', userRouter);

// custom middleware
app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

// db
mongoose
  .connect(CONFIG.MONGO_URI)
  .then(() => {
    console.log('connected to db...');
    app.listen(CONFIG.PORT, () => {
      console.log(`server started at http://localhost:${CONFIG.PORT}`);
    });
  })
  .catch(err => {
    console.error('mongodb connection failure');
    console.error(err);
  });
