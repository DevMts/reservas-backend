import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaHouseRepository } from "@/repository/prisma/prisma-house-repository";
import { UpdateHouseUseCase } from "@/use-cases/house/update-house";

export async function UpdateHouseController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    price: z.number(),
    description: z.string(),
  });
  const paransSchema = z.object({
    id: z.string(),
  });

  try {
    const { price, description } = bodySchema.parse(request.body);
    const { id } = paransSchema.parse(request.params);
    const prismaHouseRepository = new PrismaHouseRepository();
    const updatedHouse = new UpdateHouseUseCase(prismaHouseRepository);

    const house = await updatedHouse.execute(id, {
      price,
      description,
    });

    return reply.status(200).send({
      house,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.message,
      });
    }
    if (error instanceof Error) {
      return reply.status(400).send({
        error: error.message,
      });
    }
    return reply.status(500).send({
      error: "Internal server error",
    });
  }
}
