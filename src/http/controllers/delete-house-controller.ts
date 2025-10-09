import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaAddressRepository } from "@/repository/prisma/prisma-address-repository";
import { PrismaHouseRepository } from "@/repository/prisma/prisma-house-repository";
import { DeleteHouseUseCase } from "@/use-cases/house/delete-house";

export async function deleteHouseController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paransSchema = z.object({
    id: z.string(),
  });
  try {
    const { id } = paransSchema.parse(request.params);

    const houseRepository = new PrismaHouseRepository();
    const address = new PrismaAddressRepository();
    const deleteHouse = new DeleteHouseUseCase(houseRepository, address);
    await deleteHouse.execute(id);

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        details: error.message,
      });
    }
    if (error instanceof Error) {
      return reply.status(404).send({
        error: error.message,
      });
    }
    return reply.status(500).send({
      error: "Internal server error",
    });
  }
}
