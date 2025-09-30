// auth.ts

import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // ou seu provider
  }),
  emailAndPassword: {
    enabled: true,
  }, // URL do seu frontend
  // Outras configurações...
});
