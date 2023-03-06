import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import bcryptjs from 'bcryptjs';
import type { RequestHandler } from './$types';
import jwt from 'jsonwebtoken';
import { SHIRUDO_ADMIN_PASSWORD } from '$env/static/private';
import { CORS_HEADER } from '$lib/constants/appConstants';
import { z } from 'zod';

export const POST: RequestHandler = async (req) => {
  try {
    const body = await req.request.json();

    const UserLoginInputSchema = z.object({
      identity: z
        .string()
        .trim()
        .min(3)
        .regex(/^[A-Za-z0-9_-]*$/)
        .or(z.string().trim().email()),
      password: z.string().trim().min(3),
      appId: z.string().uuid(),
    });

    const userLoginInput = UserLoginInputSchema.safeParse(body);

    if (!userLoginInput.success) {
      console.error(userLoginInput.error.format());

      throw error(500, JSON.stringify(userLoginInput.error.flatten()));
    }

    const { identity, password, appId } = userLoginInput.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: identity,
          },
          {
            email: identity,
          },
        ],
        appId,
      },
      include: {
        Role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw error(401, 'Invalid credentials');
    }

    const isValidCredentials = await bcryptjs.compare(password, user.password);

    if (!isValidCredentials) {
      throw error(401, 'Invalid credentials');
    }

    const token = await jwt.sign(
      {
        username: user.username,
        id: user.id,
        role: user.Role.name,
      },
      SHIRUDO_ADMIN_PASSWORD,
      {
        expiresIn: '150s',
      }
    );

    return json(
      {
        token,
      },
      CORS_HEADER
    );
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};
