import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async (req) => {
  try {
    const id = req.params.id;
    const app = await prisma.app.delete({
      where: {
        id,
      },
    });
    return json({ app });
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};
