import { createApp } from '$lib/server/createApp';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
  try {
    const body = await req.request.json();

    const AppRegisterInputSchema = z.object({
      name: z.string().trim().min(3).max(255),
      adminPassword: z.string().trim().min(3).max(255),
    });

    const appRegisterInput = AppRegisterInputSchema.safeParse(body);

    if (!appRegisterInput.success) {
      console.error(appRegisterInput.error.format());

      throw error(500, JSON.stringify(appRegisterInput.error.flatten()));
    }

    const { name, adminPassword } = appRegisterInput.data;

    const [app, admin] = await createApp(name, adminPassword);

    return json({ app, admin: { id: admin.id, username: admin.username, role: admin.Role.name } });
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};
