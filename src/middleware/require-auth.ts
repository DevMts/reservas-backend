import type { FastifyReply, FastifyRequest } from "fastify";
import { auth } from "@/lib/auth";

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  // converte IncomingHttpHeaders para Headers
  const headers = new Headers();
  for (const [key, value] of Object.entries(request.headers)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.map((v) => headers.append(key, v));
      } else {
        headers.append(key, value);
      }
    }
  }

  const session = await auth.api.getSession({ headers });

  if (!session) {
    return reply.status(401).send({
      error: "Unauthorized",
    });
  }

  return session;
}
