import { DEFAULT_ROLES } from '$lib/constants/appConstants';
import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcryptjs from 'bcryptjs';

export const POST: RequestHandler = async (req) => {
  try {
    const body = await req.request.json();
    const { name, adminPassword } = body;

    const [app, admin] = await prisma.$transaction(async (tx) => {
      const app = await tx.app.create({
        data: {
          name,
          Roles: {
            createMany: {
              data: [{ name: DEFAULT_ROLES.ADMIN }, { name: DEFAULT_ROLES.USER }],
            },
          },
        },
      });

      const adminRole = await tx.role.findFirstOrThrow({
        where: {
          name: DEFAULT_ROLES.ADMIN,
          appId: app.id,
        },
      });

      const hashedPassword = await bcryptjs.hash(adminPassword, 10);

      const admin = await tx.user.create({
        data: {
          username: `${app.name}-${DEFAULT_ROLES.ADMIN}`,
          password: hashedPassword,
          App: {
            connect: {
              id: app.id,
            },
          },
          Role: {
            connect: {
              id: adminRole.id,
            },
          },
        },
        include: {
          Role: true,
        },
      });

      return [app, admin];
    });
    return json({ app, admin: { id: admin.id, username: admin.username, role: admin.Role.name } });
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};
