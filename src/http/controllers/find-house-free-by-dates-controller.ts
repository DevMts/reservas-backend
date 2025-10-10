import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaHouseRepository } from "@/repository/prisma/prisma-house-repository";
import { FindHouseFreeByDatesUseCase } from "@/use-cases/house/find-house-free-by-dates";

export async function findHouseFreeByDatesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    check_in: z.coerce.date(),
    check_out: z.coerce.date(),
  });
  try {
    const { check_in, check_out } = querySchema.parse(request.query);

    const houseRepository = new PrismaHouseRepository();
    const findHouseFreeByDates = new FindHouseFreeByDatesUseCase(
      houseRepository,
    );

    const houses = await findHouseFreeByDates.execute(check_in, check_out);

    const formattedHouses = houses?.map(house => ({
      ...house,
      price: house.price.toString(), // se quiser manter string
      createdAt: house.createdAt.toISOString(),
      updatedAt: house.updatedAt.toISOString(),
    }));

    return reply.status(200).send(formattedHouses);
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
    return reply.status(500).send();
  }
}
