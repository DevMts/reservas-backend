import type { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "@/repository/prisma/prisma-user-repository";
import { ListAllUserUseCase } from "@/use-cases/user/list-all-users";

export async function ListAllUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userRepository = new PrismaUserRepository();
    const listAllUser = new ListAllUserUseCase(userRepository);

    const { users } = await listAllUser.execute();

    return reply.status(200).send({
      users,
    });
  } catch (error) {
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
