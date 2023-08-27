import { CORS_HEADER } from '$lib/constants/appConstants';
import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
  try {
    const body = await req.request.json();

    const CheckUsernameInputSchema = z.object({
      username: z
        .string()
        .trim()
        .min(3)
        .regex(/^[A-Za-z0-9_-]*$/),
      appId: z.string().uuid(),
    });

    const checkUsernameInput = CheckUsernameInputSchema.safeParse(body);

    if (!checkUsernameInput.success) {
      console.error(checkUsernameInput.error.format());

      throw error(500, JSON.stringify(checkUsernameInput.error.flatten()));
    }

    const { username, appId } = checkUsernameInput.data;

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
