import { DEFAULT_ROLES } from '$lib/constants/appConstants';
import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async (req) => {
	try {
		const id = req.params.id;

		const role = await prisma.$transaction(async (tx) => {
			const role = await tx.role.findUniqueOrThrow({
				where: {
					id
				}
			});

			if (Object.keys(DEFAULT_ROLES).includes(role.name)) {
				throw error(403, 'Cannot delete default role');
			}

			const deletedRole = await tx.role.delete({
				where: {
					id
				}
			});
			return deletedRole;
		});
		return json({ role });
	} catch (err) {
		console.error(err);
		throw error(500, JSON.stringify(err));
	}
};
