import "dotenv/config";
import fastifyCors from "@fastify/cors";
import swagger from "@fastify/swagger";
import Scalar from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { auth } from "./lib/auth";

export const app = fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(swagger, {
  openapi: {
    info: {
      title: "API - Reservas",
      description: "Documentação sobre a API de Reservas",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3333" }],
  },
  transform: jsonSchemaTransform
});

app.register(Scalar, {
  routePrefix: "/docs", // URL da documentação
  configuration: {
    title: "Documentação - Mateus Carvalho",
    theme: "deepSpace", // temas: default, purple, blue, dark, solarized, etc
    darkMode: true,
    hideDownloadButton: false,
  },
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
        body:
          request.method !== "GET" ? JSON.stringify(request.body) : undefined,
      }),
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
