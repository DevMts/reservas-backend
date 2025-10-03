import { Prisma } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaUserRepository } from "@/repository/prisma/prisma-user-repository";
import { FindUserByIdUseCase } from "@/use-cases/user/find-user-by-id";

export async function findByIdUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const userRepository = new PrismaUserRepository();
    const findByIdUseCase = new FindUserByIdUseCase(userRepository);

    const { user } = await findByIdUseCase.execute(id)

    return reply.status(200).send({
      user
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.message
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.status(404).send({
          message: "User not found",
        });
      }
    }
    if (error instanceof Error) {
      return reply.status(400).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Internal server error" });
  }
}