import { SHIRUDO_JWT_SECRET } from '$env/static/private';
import { prisma } from '$lib/server/prismaClient';
import { error, json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
  const authorization = req.request.headers.get('Authorization');
  //   const ShirudoAppId = req.request.headers.get('ShirudoAppId');

  // split = ['Bearer ', 'jwt_token]
  const [, token] = authorization?.split('Bearer ') || [];

  if (!token) {
    throw error(401, 'Unauthenticated');
  }

  let decodedToken;

  try {
    decodedToken = await jwt.verify(token, SHIRUDO_JWT_SECRET);
  } catch (err) {
    throw error(401, 'Unauthenticated');
  }

  const user = await prisma.user.findFirst({
    where: {
      id: (decodedToken as { user_id: string }).user_id,
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
    throw error(401, 'Unauthenticated');
  }

  return json({
    decodedToken,
    user: {
      username: user.username,
      id: user.id,
      role: user.Role.name,
    },
  });
};
