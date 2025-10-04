import type { FastifyInstance } from "fastify";
import { createAddressController } from "../controllers/create-address-controller";

export async function addressRoutes(app: FastifyInstance) {
  app.post("/create", createAddressController);
}
