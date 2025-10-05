import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaUserRepository } from "@/repository/prisma/prisma-user-repository";
import { DeleteUserUseCase } from "@/use-cases/user/delete-user";

export async function DeleteUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paransSchema = z.object({
    id: z.string(),
  });

  try {
    const { id } = paransSchema.parse(request.params);

    const userRepository = new PrismaUserRepository();
    const deleteUser = new DeleteUserUseCase(userRepository);

    await deleteUser.execute(id);
    return reply.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.message
      });
    }
    if (error instanceof Error) {
      return reply.status(400).send({
        details: error.message
      });
    }
    return reply.status(500).send({
      error: "Internal server error"
    });
  }
}
