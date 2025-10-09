import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaHouseRepository } from "@/repository/prisma/prisma-house-repository";
import { PrismaRentalRepository } from "@/repository/prisma/prisma-rental-repository";
import { PrismaUserRepository } from "@/repository/prisma/prisma-user-repository";
import { bodySchema } from "@/schema/rental-schema";
import { CreateRentalUseCase } from "@/use-cases/rental/create-rental";

export async function createRentalController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { house, check_in, check_out, user } = bodySchema.parse(request.body);

    const rentalRepository = new PrismaRentalRepository();
    const userRepository = new PrismaUserRepository();
    const houseRepository = new PrismaHouseRepository();

    const rentalCreate = new CreateRentalUseCase(
      rentalRepository,
      houseRepository,
      userRepository,
    );

    const rental = await rentalCreate.execute({
      house,
      check_in: new Date(check_in),
      check_out: new Date(check_out),
      user,
    });

    return reply.status(201).send({
      rental,
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
