import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaUserRepository } from "@/repository/prisma/prisma-user-repository";
import { ListUserAndAddressByIdUseCase } from "@/use-cases/user/list-user-and-address-by-id";

export async function ListUserAndAddressByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paransSchema = z.object({
    id: z.string(),
  });

  try {
    const { id } = paransSchema.parse(request.params);

    const userRepository = new PrismaUserRepository();
    const listUserAndAddressById = new ListUserAndAddressByIdUseCase(userRepository);

    const userWithAddress = await listUserAndAddressById.execute(id);

    return reply.status(200).send({
      userWithAddress,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.message
      });
    }

    if (error instanceof Error) {
      return reply.status(400).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Internal server error" });
  }
}