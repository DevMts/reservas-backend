import type { FastifyInstance } from "fastify";
import { CreateHouseController } from "../controllers/create-house-controller";

export async function houseRoutes(app: FastifyInstance) {
  app.post("/create", CreateHouseController);
}
