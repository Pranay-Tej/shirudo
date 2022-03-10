import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT ?? 8080,
  MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/shirudo',
  JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
  APPS: [process.env.APP_LOCAL_CLIENT ?? 'http://localhost:3000'],
  IS_HASURA_MODE_ENABLED: process.env.IS_HASURA_MODE_ENABLED ?? false
};
