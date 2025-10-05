import type { FastifyInstance } from "fastify";
import { AddAddressForUserProfileController } from "../controllers/add-address-for-user-controller";
import { completeUserProfileController } from "../controllers/complete-profile-user-controller";
import { DeleteUserController } from "../controllers/delete-user-controller";
import { findByIdUserController } from "../controllers/find-by-id-user-controller";
import { ListAllUserController } from "../controllers/list-all-users-controller";
import { ListUserAndAddressByIdController } from "../controllers/list-user-with-address-by-id-controller";

export async function userRoutes(app: FastifyInstance) {
  app.post("/create/:id", completeUserProfileController);
  app.get("/:id", findByIdUserController);
  app.put("/add-address", AddAddressForUserProfileController);
  app.get("/:id/address", ListUserAndAddressByIdController);
  app.delete("/:id", DeleteUserController);
  app.get("/all", ListAllUserController);
}
