import { sign } from 'jsonwebtoken';
import { CONFIG } from '../config/app.config';

export const newToken = (user: any) => {
  return sign(user, CONFIG.JWT_SECRET, {
    // expiresIn: 24 * 60 * 60 /* 1 day */,
    expiresIn: '1d' /* 1 day */
    // expiresIn: "60s" /* 10 seconds */,
  });
};
