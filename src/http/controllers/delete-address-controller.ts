import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaAddressRepository } from "@/repository/prisma/prisma-address-repository";
import { DeleteAddressUseCase } from "@/use-cases/address/delete-address";

export async function deleteAddressController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);
    const prismaAddressRepository = new PrismaAddressRepository();
    const deletedAddress = new DeleteAddressUseCase(prismaAddressRepository);

    await deletedAddress.execute(id);

    return reply.status(200).send({
      message: "Address deleted successfully",
    });
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