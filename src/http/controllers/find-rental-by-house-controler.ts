import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaHouseRepository } from "@/repository/prisma/prisma-house-repository";
import { PrismaRentalRepository } from "@/repository/prisma/prisma-rental-repository";
import { FindRentalByHouseUseCase } from "@/use-cases/rental/find-rental-by-house";

export async function findRentalByHouseController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    house: z.string(),
  });
  try {
    const { house } = querySchema.parse(request.query);

    const rentalRepository = new PrismaRentalRepository();
    const houseRepository = new PrismaHouseRepository();
    const findRentalByHouse = new FindRentalByHouseUseCase(rentalRepository, houseRepository);

    const rental = await findRentalByHouse.execute(house)
    return reply.status(200).send(rental)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.message,
      }
      )
    }
    if (error instanceof Error) {
      return reply.status(400).send({
        error: error.message,
      }
      )
    }
    return reply.status(500).send()
  }
}
