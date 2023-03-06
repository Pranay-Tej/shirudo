import { DEFAULT_ROLES } from '$lib/constants/appConstants';
import { prisma } from './prismaClient';
import bcryptjs from 'bcryptjs';

export const createApp = (name: string, adminPassword: string) =>
  prisma.$transaction(async (tx) => {
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

    return [app, admin] as const;
  });
