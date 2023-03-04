import { SHIRUDO_ADMIN_PASSWORD } from '$env/static/private';
import { AUTH_STATUS, AUTH_STATUS_AUTHENTICATED } from '$lib/constants/appConstants';
import { ROUTES } from '$lib/constants/routes';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import jwt from 'jsonwebtoken';

const options: Handle = async ({ event, resolve }) => {
	if (event.request.method === 'OPTIONS') {
		return new Response(null, {
			status: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': 'true'
			}
		});
	}
	return await resolve(event);
};

const authenticate: Handle = async ({ event, resolve }) => {
	if (!event.route.id?.includes('/(private)')) {
		return await resolve(event);
	}

	const token = event.cookies.get(AUTH_STATUS) ?? '';
	let decoded;
	try {
		decoded = await jwt.verify(token, SHIRUDO_ADMIN_PASSWORD);
	} catch (err) {
		console.error('Invalid token');
	}

	if ((decoded as { [AUTH_STATUS]: string })?.[AUTH_STATUS] !== AUTH_STATUS_AUTHENTICATED) {
		throw redirect(301, ROUTES.login);
	}

	return await resolve(event);
};

export const handle = sequence(options, authenticate);
