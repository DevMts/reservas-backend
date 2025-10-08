import z from "zod";
import { requireAuth } from "@/middleware/require-auth";
import { bodySchema as addressBodySchema } from "@/schema/address-schema";
import {
  bodySchema as userBodySchema,
  userResponse,
} from "@/schema/user-schema";
import type { FastifyTypedInstance } from "@/types";
import { AddAddressForUserProfileController } from "../controllers/add-address-for-user-controller";
import { completeUserProfileController } from "../controllers/complete-profile-user-controller";
import { DeleteUserController } from "../controllers/delete-user-controller";
import { findByIdUserController } from "../controllers/find-by-id-user-controller";
import { ListAllUserController } from "../controllers/list-all-users-controller";
import { ListUserAndAddressByIdController } from "../controllers/list-user-with-address-by-id-controller";

export async function userRoutes(app: FastifyTypedInstance) {
  app.post(
    "/create/:id",
    {
      schema: {
        tags: ["User"],
        description: "Complete user profile",
        params: z.object({
          id: z.string(),
        }),
        body: userBodySchema,
        response: {
          200: z.object({
            user: userResponse,
          }),
        },
      },
    },
    completeUserProfileController,
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["User"],
        description: "Find user by ID",
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            user: userResponse,
          }),
        },
      },
    },
    findByIdUserController,
  );

  app.put(
    "/add-address",
    {
      schema: {
        tags: ["User"],
        description: "Add address to user profile",
        body: z.object({
          userId: z.string(),
          addressId: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            updatedUser: userResponse,
          }),
        },
      },
    },
    AddAddressForUserProfileController,
  );

  app.get(
    "/:id/address",
    {
      schema: {
        tags: ["User"],
        description: "List user with address by ID",
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            userWithAddress: userBodySchema.extend({
              address: addressBodySchema,
            }),
          }),
        },
      },
    },
    ListUserAndAddressByIdController,
  );

  app.delete(
    "/:id",

    {
      preHandler: [requireAuth],
      schema: {
        tags: ["User"],
        description: "Delete user by ID",
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.object({
            message: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
        },
      },
    },
    DeleteUserController,
  );

  app.get(
    "/all",
    {
      schema: {
        tags: ["User"],
        description: "List all users",
        // response: {
        //   200: z.object({
        //     users: z.array(userResponse),
        //   }),
        // },
      },
    },
    ListAllUserController,
  );
}
