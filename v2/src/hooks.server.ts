import { SHIRUDO_JWT_SECRET } from '$env/static/private';
import { AUTH_STATUS, AUTH_STATUS_AUTHENTICATED } from '$lib/constants/appConstants';
import { ROUTES } from '$lib/constants/routes';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';

const handleApiCors: Handle = async ({ event, resolve }) => {
  // Apply CORS header for API routes
  if (event.url.pathname.startsWith('/api')) {
    // Required for CORS to work
    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }
  }

  const response = await resolve(event);
  if (event.url.pathname.startsWith('/api')) {
    response.headers.append('Access-Control-Allow-Origin', `*`);
  }
  return response;
};

const authenticate: Handle = async ({ event, resolve }) => {
  if (!event.route.id?.includes('/(private)')) {
    return await resolve(event);
  }

  const token = event.cookies.get(AUTH_STATUS) ?? '';
  let decoded;
  try {
    decoded = await jwt.verify(token, SHIRUDO_JWT_SECRET);
  } catch (err) {
    console.error('Invalid token');
  }

  if ((decoded as { [AUTH_STATUS]: string })?.[AUTH_STATUS] !== AUTH_STATUS_AUTHENTICATED) {
    throw redirect(301, ROUTES.login);
  }

  return await resolve(event);
};

export const handle = sequence(handleApiCors, authenticate);
