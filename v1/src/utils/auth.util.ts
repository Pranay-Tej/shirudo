import CryptoJs from 'crypto-js';
import { sign } from 'jsonwebtoken';
import { CONFIG } from '../config/app.config';
import { NotFoundError } from '../errors/not-found.error';
import { AppSecret } from '../models/AppSecret';

export const newToken = async (user: any, app_id: string) => {
  const appSecretDoc = await AppSecret.findOne({ app_id });
  if (!appSecretDoc) {
    throw new NotFoundError(AppSecret.modelName);
  }
  const decryptedSecret = CryptoJs.AES.decrypt(
    appSecretDoc.jwt_secret,
    CONFIG.ENCRYPTION_KEY
  ).toString(CryptoJs.enc.Utf8);

  return sign(user, decryptedSecret, {
    // expiresIn: 24 * 60 * 60 /* 1 day */,
    expiresIn: '1d' /* 1 day */
    // expiresIn: "60s" /* 10 seconds */,
  });
};
