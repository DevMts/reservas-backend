import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaUserRepository } from "@/repository/prisma/prisma-user-repository";
import { bodySchema } from "@/schema/user-schema";
import { CompleteUserProfileUseCase } from "@/use-cases/user/complete-user-profile";

export async function completeUserProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);
    const { date_birth, cpf, ddd, phone, id_address } = bodySchema.parse(
      request.body,
    );

    const prismaUserRepository = new PrismaUserRepository();
    const completeUserProfile = new CompleteUserProfileUseCase(
      prismaUserRepository,
    );

    const user = await completeUserProfile.execute({
      userId: id,
      date_birth: new Date(date_birth),
      cpf,
      ddd,
      phone,
      id_address: id_address ?? null,
    });

    return reply.status(201).send({
      message: "Profile completed successfully",
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.message,
      });
    }
    if (error instanceof Error) {
      return reply.status(400).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Internal server error" });
  }
}
