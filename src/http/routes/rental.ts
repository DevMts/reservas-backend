import z from "zod";
import { bodySchema, responseSchema } from "@/schema/rental-schema";
import type { FastifyTypedInstance } from "@/types";
import { createRentalController } from "../controllers/create-rental-controller";

export async function rentalRoutes(app: FastifyTypedInstance) {
  app.post(
    "/create",
    {
      schema: {
        tags: ["Rental"],
        description: "Create a new rental",
        body: bodySchema,
        response: {
          201: z.object({
            rental: responseSchema,
          }),
          400: z.object({
            details: z.string()
          })
        },
      },
    },
    createRentalController,
  );
}
