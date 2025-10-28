import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { auth } from "../lib/auth";

export async function handleBetterAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log("🔵 Better Auth Request:", request.method, request.url);

  try {
    const url = new URL(request.url, "http://localhost:3333");

    if (request.url === "/api/auth/update-user") {
      const body = z.object({
        name: z.string().optional(),
        image: z.url().optional(),
      });
      const { name, image } = body.parse(request.body);
      await auth.api.updateUser({
        body: {
          name,
          image,
        },
        headers: request.headers as HeadersInit,
      });
      return reply.status(204).send({ success: true });
    }

    if (request.url === "/api/auth/get-id") {
      const headerEntries = Object.entries(request.headers)
        .filter(([_key, value]) => typeof value === "string") as [string, string][];

      const headers = new Headers(headerEntries);

      const session = await auth.api.getSession({ headers });
      const id = session?.user?.id || null;

      return reply.status(200).send({ success: true, id });
    }



    const response = await auth.handler(
      new Request(url.toString(), {
        method: request.method,
        headers: request.headers as HeadersInit,
        body:
          request.method !== "GET" && request.body
            ? JSON.stringify(request.body)
            : undefined,
      }),
    );

    response.headers.forEach((value: string, key: string) => {
      reply.header(key, value);
    });

    console.log("🟢 Better Auth Response:", response.status);
    console.log("Headers:", response.headers);

    const contentType = response.headers.get("content-type");


    if (response.status === 302 || response.status === 301) {
      return reply.code(response.status).send();
    }

    if (contentType?.includes("application/json")) {
      const text = await response.text();
      if (text) {
        const data = JSON.parse(text);
        return reply.code(response.status).send(data);
      }
    }

    return reply.code(response.status).send();

  } catch (error) {
    console.error("❌ Better Auth Error:", error);

    return reply.code(500).send({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}