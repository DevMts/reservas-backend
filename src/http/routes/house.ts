import z from "zod";
import { bodySchema, responseSchema } from "@/schema/house-schema";
import type { FastifyTypedInstance } from "@/types";
import { CreateHouseController } from "../controllers/create-house-controller";
import { deleteHouseController } from "../controllers/delete-house-controller";
import { findHouseByAddressController } from "../controllers/find-house-by-address-controller";
import { findHouseByIdController } from "../controllers/find-house-by-id-controller";
import { findHouseByUserController } from "../controllers/find-house-by-user-conttroller";
import { findHouseFreeByDatesController } from "../controllers/find-house-free-by-dates-controller";
import { updateHouseController } from "../controllers/update-house-controller";

export async function houseRoutes(app: FastifyTypedInstance) {
  app.post(
    "/create",
    {
      schema: {
        tags: ["House"],
        description: "Create a new house",
        body: bodySchema,
        response: {
          201: z.object({
            house: responseSchema,
          }),
        },
      },
    },
    CreateHouseController,
  );
  app.put(
    "/update/:id",
    {
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
            house: responseSchema,
          }),
        },
      },
    },
    updateHouseController,
  );
  app.get(
    "/:id",
    {
      schema: {
        tags: ["House"],
        description: "Find house",
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            house: responseSchema.nullable(),
          }),
        },
      },
    },
    findHouseByIdController,
  );
  app.get(
    "/user",
    {
      schema: {
        tags: ["House"],
        description: "Find house by user",
        querystring: z.object({
          user: z.string().optional(),
          nome: z.string().optional(),
        }),
        response: {
          200: z.object({
            houses: z.array(responseSchema),
          }),
        },
      },
    },
    findHouseByUserController,
  );
  app.get(
    "/address",
    {
      schema: {
        tags: ["House"],
        description: "Find house by address",
        querystring: z.object({
          cep: z.string().optional(),
          city: z.string().optional(),
          country: z.string().optional(),
          neighborhood: z.string().optional(),
          road: z.string().optional(),
          state: z.string().optional(),
        }),
        response: {
          200: z.object({
            houses: z.array(responseSchema),
          }),
        },
      },
    },
    findHouseByAddressController,
  );
  app.get(
    "/dates",
    {
      schema: {
        tags: ["House"],
        description: "Find house free by dates",
        querystring: z.object({
          check_in: z.coerce.date(),
          check_out: z.coerce.date(),
        }),
        response: {
          200: z.array(responseSchema).nullable()
        },
      },
    },
    findHouseFreeByDatesController,
  );
  app.delete(
    "/:id",
    {
      schema: {
        tags: ["House"],
        description: "Delete a house",
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    deleteHouseController,
  );
}
