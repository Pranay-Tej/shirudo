import { CORS_HEADER } from '$lib/constants/appConstants';
import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
  try {
    const body = await req.request.json();

    const CheckEmailInputSchema = z.object({
      email: z.string().trim().email(),
      appId: z.string().uuid(),
    });

    const checkEmailInput = CheckEmailInputSchema.safeParse(body);

    if (!checkEmailInput.success) {
      console.error(checkEmailInput.error.format());

      throw error(500, JSON.stringify(checkEmailInput.error.flatten()));
    }

    const { email, appId } = checkEmailInput.data;

    const user = await prisma.user.findFirst({
      where: {
        email,
        appId,
      },
    });
    if (user) {
      throw error(500, 'email is already taken');
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
