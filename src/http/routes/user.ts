import type { FastifyInstance } from "fastify";
import { AddAddressForUserProfileController } from "../controllers/add-address-for-user-controller";
import { completeUserProfileController } from "../controllers/create-user-controller";
import { findByIdUserController } from "../controllers/find-by-id-user-controller";

export async function userRoutes(app: FastifyInstance) {
  app.post("/create/:id", completeUserProfileController);
  app.get("/:id", findByIdUserController);
  app.put("/add-address", AddAddressForUserProfileController);
}
