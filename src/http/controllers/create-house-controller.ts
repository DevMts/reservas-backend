import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaAddressRepository } from "@/repository/prisma/prisma-address-repository";
import { PrismaHouseRepository } from "@/repository/prisma/prisma-house-repository";
import { PrismaUserRepository } from "@/repository/prisma/prisma-user-repository";
import { CreateHouseUseCase } from "@/use-cases/house/create-house";

export async function CreateHouseController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    price: z.number(),
    description: z.string(),
    id_owner: z.string(),
    id_address: z.string(),
  });

  try {
    const { price, description, id_owner, id_address } = bodySchema.parse(
      request.body,
    );
    const prismaHouseRepository = new PrismaHouseRepository();
    const prismaUserRepository = new PrismaUserRepository();
    const prismaAddressRepository = new PrismaAddressRepository();

    const createHouse = new CreateHouseUseCase(
      prismaHouseRepository,
      prismaUserRepository,
      prismaAddressRepository,
    );

    const house = await createHouse.execute({
      price,
      description,
      id_owner,
      id_address,
    });

    return reply.status(201).send({
      house,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.message,
      });
    }
    if (error instanceof Error) {
      return reply.status(400).send({
        details: error.message,
      });
    }
    return reply.status(500).send({
      error: "Internal server error",
    });
  }
}
