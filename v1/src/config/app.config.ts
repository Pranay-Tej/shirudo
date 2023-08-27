import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT ?? 8080,
  MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/shirudo',
  JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? 'secretkey',
  APPS: [
    process.env.APP_LOCAL_CLIENT ?? 'http://localhost:3000',
    process.env.REACT_STORE_PROD as string,
    process.env.REACT_STORE_DEV as string
  ],
  IS_HASURA_MODE_ENABLED: process.env.IS_HASURA_MODE_ENABLED ?? false
};
