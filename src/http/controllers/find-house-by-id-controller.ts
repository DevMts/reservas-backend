import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaHouseRepository } from "@/repository/prisma/prisma-house-repository";
import { FindHouseByIdUseCase } from "@/use-cases/house/find-house-by-id";

export async function findHouseByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paransSchema = z.object({
    id: z.string(),
  });

  try {
    const { id } = paransSchema.parse(request.params);

    const houseRepository = new PrismaHouseRepository();
    const findHouseById = new FindHouseByIdUseCase(houseRepository);

    const house = await findHouseById.execute(id);
    return reply.status(200).send({
      house: {
        ...house,
        price: Number(house?.price),
        createdAt: house?.createdAt.toISOString(),
        updatedAt: house?.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.message,
      });
    }
    if (error instanceof Error) {
      return reply.status(404).send({
        error: error.message,
      });
    }
    return reply.status(500).send({
      error: "Internal server error",
    });
  }
}
