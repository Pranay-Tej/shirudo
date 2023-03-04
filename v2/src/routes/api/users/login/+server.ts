import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import bcryptjs from 'bcryptjs';
import type { RequestHandler } from './$types';
import jwt from 'jsonwebtoken';
import { SHIRUDO_ADMIN_PASSWORD } from '$env/static/private';
import { CORS_HEADER } from '$lib/constants/appConstants';

export const POST: RequestHandler = async (req) => {
	try {
		const body = await req.request.json();
		const { identity, password, appId } = body;

		const user = await prisma.user.findFirst({
			where: {
				OR: [
					{
						username: identity
					},
					{
						email: identity
					}
				],
				appId
			},
			include: {
				Role: {
					select: {
						name: true
					}
				}
			}
		});

		if (!user) {
			throw error(401, 'Invalid credentials');
		}

		const isValidCredentials = await bcryptjs.compare(password, user.password);

		if (!isValidCredentials) {
			throw error(401, 'Invalid credentials');
		}

		const token = await jwt.sign(
			{
				username: user.username,
				id: user.id,
				role: user.Role.name
			},
			SHIRUDO_ADMIN_PASSWORD,
			{
				expiresIn: '150s'
			}
		);

		return json(
			{
				token
			},
			CORS_HEADER
		);
	} catch (err) {
		console.error(err);
		throw error(500, JSON.stringify(err));
	}
};
