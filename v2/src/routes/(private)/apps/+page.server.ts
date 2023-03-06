import { createApp } from '$lib/server/createApp';
import { prisma } from '$lib/server/prismaClient';
import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const apps = await prisma.app.findMany();
    return {
      apps,
    };
  } catch (err) {
    console.error(err);
    throw error(500, JSON.stringify(err));
  }
};

export const actions: Actions = {
  default: async (event) => {
    try {
      const data = Object.fromEntries(await event.request.formData());

      const AppRegisterInputSchema = z.object({
        name: z.string().trim().min(3).max(255),
        adminPassword: z.string().trim().min(3).max(255),
      });

      const appRegisterInput = AppRegisterInputSchema.safeParse(data);

      if (!appRegisterInput.success) {
        console.error(appRegisterInput.error.format());

        throw error(500, JSON.stringify(appRegisterInput.error.flatten()));
      }

      const { name, adminPassword } = appRegisterInput.data;

      const [app, admin] = await createApp(name, adminPassword);

      return { app, admin: { id: admin.id, username: admin.username, role: admin.Role.name } };
    } catch (err) {
      console.error(err);
      return fail(500, { badRequest: true });
    }
  },
};
