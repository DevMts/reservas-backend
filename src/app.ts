import "dotenv/config";
import fastifyCors from "@fastify/cors";
import fastifyRoutes from "@fastify/routes";
import fastify from "fastify";
import { env } from "./env";

export const app = fastify();
app.register(fastifyRoutes);

// Configure CORS policies
app.register(fastifyCors, {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

// Mount authentication handler after CORS registration
// (Use previous handler configuration here)

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}, in ${env.PORT} mode`);
});
