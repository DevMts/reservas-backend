import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaHouseRepository } from "@/repository/prisma/prisma-house-repository";
import { FindHouseByAddressUseCase } from "@/use-cases/house/find-house-by-address";

export async function findHouseByAddressController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    road: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    cep: z.string().optional(),
    country: z.string().optional(),
    neighborhood: z.string().optional(),
  });
  try {
    const { road, city, state, cep, country, neighborhood } = querySchema.parse(
      request.query,
    );

    const houseRepository = new PrismaHouseRepository();
    const findHouseByAddress = new FindHouseByAddressUseCase(houseRepository);

    const houses = await findHouseByAddress.execute({
      road,
      city,
      state,
      cep,
      country,
      neighborhood,
    });

    return reply.status(200).send({
      houses: houses?.map((h) => ({
        ...h,
        price: Number(h.price),
        createdAt: h.createdAt.toISOString(),
        updatedAt: h.updatedAt.toISOString(),
      })),
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
        details: error.message,
      });
    }
    return reply.status(500).send({
      error: "Internal server error",
    });
  }
}
