import { SHIRUDO_ADMIN_SECRET } from '$env/static/private';
import { AUTH_STATUS, AUTH_STATUS_AUTHENTICATED } from '$lib/constants/appConstants';
import { ROUTES } from '$lib/constants/routes';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import jwt from 'jsonwebtoken';

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const adminPassword = data.get('password') as string;

    if (adminPassword !== SHIRUDO_ADMIN_SECRET) {
      console.error('Invalid credentials');
      return fail(400, { credentials: true });
    }

    let token;
    try {
      token = await jwt.sign(
        {
          [AUTH_STATUS]: AUTH_STATUS_AUTHENTICATED,
        },
        SHIRUDO_ADMIN_SECRET,
        {
          expiresIn: '1d',
          // expiresIn: '20s'
        }
      );
    } catch (err) {
      console.error(err);
      return fail(500, { serverError: true });
    }

    event.cookies.set(AUTH_STATUS, token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60, // (in seconds) 24 * 1h * 1m = 1 day
      // maxAge: 20 // in seconds
    });
    throw redirect(303, ROUTES.dashboard);
  },
};
