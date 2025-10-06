import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { auth } from "../lib/auth"; // Importe seu Better Auth aqui

export async function handleBetterAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log("🔵 Better Auth Request:", request.method, request.url);

  try {
    // Constrói a URL completa
    const url = new URL(request.url, "http://localhost:3333");

    if (request.url === "/api/auth/update-user") {

      const body = z.object({
        name: z.string().optional(),
        image: z.url().optional(),
      })
      const { name, image } = body.parse(request.body);
      await auth.api.updateUser({
        body: {
          name,
          image,
        },
        headers: request.headers as HeadersInit,
      },);
      return reply.status(204).send({ success: true });
    }

    // Chama o handler do Better Auth
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

    // Copia todos os headers da resposta
    response.headers.forEach((value: string, key: string) => {
      reply.header(key, value);
    });

    // Retorna a resposta
    console.log("🟢 Better Auth Response:", response.status);
    console.log("Headers:", response.headers);

    const data = await response.json();
    return reply.code(response.status).send(data);
  } catch (error) {
    console.error("❌ Better Auth Error:", error);

    return reply.code(500).send({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
