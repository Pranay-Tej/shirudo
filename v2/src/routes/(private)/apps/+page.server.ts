import { DEFAULT_ROLES } from '$lib/constants/appConstants';
import { prisma } from '$lib/server/prismaClient';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const apps = await prisma.app.findMany();
		return {
			apps
		};
	} catch (err) {
		console.error(err);
		throw error(500, JSON.stringify(err));
	}
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const data = await event.request.formData();
			const name = data.get('name') as string;
			const adminPassword = data.get('password') as string;

			const [app, admin] = await prisma.$transaction(async (tx) => {
				const app = await tx.app.create({
					data: {
						name: name,
						Roles: {
							createMany: {
								data: [{ name: DEFAULT_ROLES.ADMIN }, { name: DEFAULT_ROLES.USER }]
							}
						}
					}
				});

				const adminRole = await tx.role.findFirstOrThrow({
					where: {
						name: DEFAULT_ROLES.ADMIN,
						appId: app.id
					}
				});

				const admin = await tx.user.create({
					data: {
						username: `${app.name}-${DEFAULT_ROLES.ADMIN}`,
						password: adminPassword,
						App: {
							connect: {
								id: app.id
							}
						},
						Role: {
							connect: {
								id: adminRole.id
							}
						}
					},
					include: {
						Role: true
					}
				});

				return [app, admin];
			});
			return { app, admin: { id: admin.id, username: admin.username, role: admin.Role.name } };
		} catch (err) {
			console.error(err);
			return fail(500, { badRequest: true });
		}
	}
};
