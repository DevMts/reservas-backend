import "dotenv/config";
import fastifyCors from "@fastify/cors";
import fastifyRoutes from "@fastify/routes";
import fastify from "fastify";
import { auth } from "./lib/auth";

export const app = fastify({
  logger: true,
});

app.register(fastifyRoutes);

app.register(fastifyCors, {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

// Use a API diretamente do Better Auth (sem toNodeHandler)
app.all("/api/auth/*", async (request, reply) => {
  console.log("🔵 Request:", request.method, request.url);

  request.url.replace("/api/auth", "");

  try {
    // Chama a API interna do Better Auth
    const response = await auth.handler(
      new Request(`http://localhost${request.url}`, {
        method: request.method,
        headers: request.headers as HeadersInit,
        body: request.method !== "GET" ? JSON.stringify(request.body) : undefined,
      })
    );

    // Copia headers da resposta
    response.headers.forEach((value, key) => {
      reply.header(key, value);
    });

    // Envia o corpo da resposta
    const data = await response.json();
    return reply.code(response.status).send(data);
  } catch (error) {
    console.error("❌ Error:", error);
    return reply.code(500).send({ error: "Internal server error" });
  }
});

app.get("/health", async () => {
  return { status: "ok" };
});