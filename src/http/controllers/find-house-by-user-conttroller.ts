import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaHouseRepository } from "@/repository/prisma/prisma-house-repository";
import { FindHouseByUserUseCase } from "@/use-cases/house/find-by-user";

export async function findHouseByUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    user: z.string().optional(),
    nome: z.string().optional(),
  });
  try {
    const { user, nome } = querySchema.parse(request.query);

    const houseRepository = new PrismaHouseRepository();
    const findHouseByUser = new FindHouseByUserUseCase(
      houseRepository,
    );

    const house = await findHouseByUser.execute(user, nome);


    return reply.status(200).send({
      houses: house?.map((h) => ({
        ...h,
        price: Number(h.price),
        createdAt: h.createdAt.toISOString(),
        updatedAt: h.updatedAt.toISOString(),
      })),
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
