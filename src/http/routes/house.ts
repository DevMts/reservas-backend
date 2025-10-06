import z from "zod";
import { bodySchema } from "@/schema/house-schema";
import type { FastifyTypedInstance } from "@/types";
import { CreateHouseController } from "../controllers/create-house-controller";
import { UpdateHouseController } from "../controllers/update-house-controller";

export async function houseRoutes(app: FastifyTypedInstance) {
  app.post("/create", {
    schema: {
      tags: ["House"],
      description: "Create a new house",
      body: bodySchema,
      response: {
        201: z.object({
          house: bodySchema,
        }),
      }
    }
  }, CreateHouseController);
  app.put("/update/:id", {
    schema: {
      tags: ["House"],
      description: "Update a house",
      body: z.object({
        price: z.number(),
        description: z.string(),
      }),
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          house: bodySchema,
        }),
      }
    }
  }, UpdateHouseController);
}
