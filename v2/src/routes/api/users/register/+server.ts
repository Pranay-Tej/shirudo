import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcryptjs from 'bcryptjs';
import { CORS_HEADER, DEFAULT_ROLES } from '$lib/constants/appConstants';
import { z } from 'zod';

export const POST: RequestHandler = async (req) => {
  try {
    const body = await req.request.json();

    const UserRegisterInputSchema = z.object({
      username: z
        .string()
        .trim()
        .min(3)
        .regex(/^[A-Za-z0-9_-]*$/),
      email: z.string().trim().email(),
      password: z.string().trim().min(3),
      appId: z.string().uuid(),
    });

    const userRegisterInput = UserRegisterInputSchema.safeParse(body);

    if (!userRegisterInput.success) {
      console.error(userRegisterInput.error.format());

      throw error(500, JSON.stringify(userRegisterInput.error.flatten()));
    }

    const { username, email, password, appId } = userRegisterInput.data;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const userRole = await tx.role.findFirstOrThrow({
        where: {
          name: DEFAULT_ROLES.USER,
          appId,
        },
      });
      const user = tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          Role: {
            connect: {
              id: userRole.id,
            },
          },
          App: {
            connect: {
              id: appId,
            },
          },
        },
        include: {
          Role: {
            select: {
              name: true,
            },
          },
        },
      });
      return user;
    });

    return json(
      {
        user: {
          username: user.username,
          id: user.id,
          role: user.Role.name,
        },
      },
      CORS_HEADER
    );
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};
