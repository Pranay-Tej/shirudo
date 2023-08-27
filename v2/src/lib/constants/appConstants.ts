export enum DEFAULT_ROLE {
  admin = 'admin',
  user = 'user',
}

export const AUTH_STATUS = 'AUTH_STATUS';

export const AUTH_STATUS_AUTHENTICATED = 'AUTHENTICATED';

export const CORS_HEADER = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  },
} as const;
