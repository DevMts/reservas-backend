import z from "zod";
import { bodySchema, responseSchema } from "@/schema/address-schema";
import type { FastifyTypedInstance } from "@/types";
import { createAddressController } from "../controllers/create-address-controller";
import { deleteAddressController } from "../controllers/delete-address-controller";

export async function addressRoutes(app: FastifyTypedInstance) {
  app.post(
    "/create",
    {
      // preHandler: [requireAuth],
      schema: {
        tags: ["Address"],
        description: "Create a new address",
        body:
          bodySchema,
        response: {
          201: z.object({
            message: z.string(),
            address:
              responseSchema,
          }),
        },
      },

    },
    createAddressController,
  );
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Address"],
        description: "Delete an address",
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.object({
            message: z.string(),
          }),
        },
      },
    },
    deleteAddressController,
  );
}
