import "dotenv/config";
import { log } from "node:console";
import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.url().startsWith("postgresql://"),
	BETTER_AUTH_SECRET: z.string().nonempty(),
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
