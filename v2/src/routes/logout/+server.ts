import { AUTH_STATUS } from '$lib/constants/appConstants';
import { ROUTES } from '$lib/constants/routes';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
	req.cookies.delete(AUTH_STATUS);
	throw redirect(303, ROUTES.login);
};
