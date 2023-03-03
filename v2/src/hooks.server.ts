import { AUTH_STATUS, AUTH_STATUS_AUTHENTICATED } from '$lib/constants/appConstants';
import { ROUTES } from '$lib/constants/routes';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const authStatus = event.cookies.get(AUTH_STATUS);

	if (event.route.id?.startsWith('/(private)') && authStatus !== AUTH_STATUS_AUTHENTICATED) {
		throw redirect(301, ROUTES.login);
	}
	return await resolve(event);
};
