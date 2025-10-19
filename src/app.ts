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
export const app = fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "http://localhost:3000", credentials: true });

app.register(swagger, {
  openapi: {
    info: {
      title: "API - Reservas",
      description: "Documentação sobre a API de Reservas",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
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

