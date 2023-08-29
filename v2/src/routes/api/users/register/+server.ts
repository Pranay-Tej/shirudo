import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import bcryptjs from 'bcryptjs';
import { DEFAULT_ROLE } from '$lib/constants/appConstants';
import { z } from 'zod';
import { HASURA_HEADERS_CONFIG } from '$lib/constants/hasuraHeaders';
import { SHIRUDO_JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

export const POST: RequestHandler = async (req) => {
  try {
    const body = await req.request.json();

    const UserRegisterInputSchema = z.object({
      username: z
        .string()
        .trim()
        .min(3)
        .regex(/^[A-Za-z0-9_-]*$/),
      email: z.string().trim().email().optional(),
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
          name: DEFAULT_ROLE.user,
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

    const tokenPayload: any = {
      username: user.username,
      user_id: user.id,
      role: user.Role.name,
    };

    const namespace = HASURA_HEADERS_CONFIG.HASURA_NAMESPACE;
    tokenPayload[namespace] = {};
    tokenPayload[namespace][HASURA_HEADERS_CONFIG.HASURA_ALLOWED_ROLES] = [user.Role.name];
    tokenPayload[namespace][HASURA_HEADERS_CONFIG.HASURA_DEFAULT_ROLE] = user.Role.name;
    tokenPayload[namespace][HASURA_HEADERS_CONFIG.HASURA_USER_ID] = user.id;

    const token = await jwt.sign(tokenPayload, SHIRUDO_JWT_SECRET, {
      // expiresIn: '150s',
      expiresIn: '1h',
    });

    return json({ token });
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};
