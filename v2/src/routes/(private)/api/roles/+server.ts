import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
  try {
    const body = await req.request.json();

    const RoleInputSchema = z.object({
      name: z.string().trim().min(3).max(255),
      appId: z.string().uuid(),
    });

    const roleInput = RoleInputSchema.safeParse(body);

    if (!roleInput.success) {
      console.error(roleInput.error.format());

      throw error(500, JSON.stringify(roleInput.error.flatten()));
    }

    const { name, appId } = roleInput.data;

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
