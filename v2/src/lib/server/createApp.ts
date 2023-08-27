import { DEFAULT_ROLE } from '$lib/constants/appConstants';
import { prisma } from './prismaClient';
import bcryptjs from 'bcryptjs';

export const createApp = (name: string, adminPassword: string) =>
  prisma.$transaction(async (tx) => {
    const app = await tx.app.create({
      data: {
        name,
        Roles: {
          createMany: {
            data: [{ name: DEFAULT_ROLE.admin }, { name: DEFAULT_ROLE.user }],
          },
        },
      },
    });

    const adminRole = await tx.role.findFirstOrThrow({
      where: {
        name: DEFAULT_ROLE.admin,
        appId: app.id,
      },
    });

    const hashedPassword = await bcryptjs.hash(adminPassword, 10);

    const admin = await tx.user.create({
      data: {
        username: `${app.name}-${DEFAULT_ROLE.admin}`,
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
