import { SHIRUDO_ADMIN_PASSWORD } from '$env/static/private';
import { AUTH_STATUS, AUTH_STATUS_AUTHENTICATED } from '$lib/constants/appConstants';
import { ROUTES } from '$lib/constants/routes';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const adminPassword = data.get('password') as string;

		if (adminPassword === SHIRUDO_ADMIN_PASSWORD) {
			event.cookies.set(AUTH_STATUS, AUTH_STATUS_AUTHENTICATED, {
				httpOnly: true
			});
			throw redirect(303, ROUTES.dashboard);
		}
		return fail(400, { credentials: true });
	}
};
