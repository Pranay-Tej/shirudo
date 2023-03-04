import { ROUTE_DATA_KEYS } from '$lib/constants/routes';
import { prisma } from '$lib/server/prismaClient';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, depends }) => {
  depends(ROUTE_DATA_KEYS.appById);

  try {
    const app = await prisma.app.findUniqueOrThrow({
      where: {
        id: params.id,
      },
      include: {
        Roles: {
          select: {
            id: true,
            name: true,
          },
        },
        Users: {
          select: {
            username: true,
            email: true,
            id: true,
            Role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      app,
    };
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};
