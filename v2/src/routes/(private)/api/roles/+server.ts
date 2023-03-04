import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
  try {
    const body = await req.request.json();
    const { name, appId } = body;

    const role = await prisma.role.create({
      data: {
        name,
        App: {
          connect: {
            id: appId,
          },
        },
      },
    });

    return json({ role });
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};
