import "dotenv/config";
import { log } from "node:console";
import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().nonempty(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SITE_URL: z.url().default("http://localhost:3000"),
  SITE_API_URL: z.url().default("http://localhost:3333"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables:", _env.error);
  throw new Error("Invalid environment variables");
}
log(
  "Environment variables loaded successfully" +
    JSON.stringify(_env.data, null, 2),
);
export const env = _env.data;
