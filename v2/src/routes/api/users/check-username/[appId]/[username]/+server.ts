import { CORS_HEADER } from '$lib/constants/appConstants';
import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
  try {
    const appId = req.params.appId;
    const username = req.params.username;

    const user = await prisma.user.findFirst({
      where: {
        username,
        appId,
      },
    });
    if (user) {
      throw error(500, 'username is already taken');
    }
    return json(
      {
        available: true,
      },
      CORS_HEADER
    );
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};
