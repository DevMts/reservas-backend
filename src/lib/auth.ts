// auth.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashed = await bcrypt.hash(password, salt);
        return hashed;
      },
      async comparePassword(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
      }
    }
  },
});
