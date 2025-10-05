import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaAddressRepository } from "@/repository/prisma/prisma-address-repository";
import { UpdateAddressUseCase } from "@/use-cases/address/update-address";

export async function UpdateAddressController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    road: z.string(),
    neighborhood: z.string(),
    house_number: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    cep: z.string(),
  });

  const paransSchema = z.object({
    id: z.string(),
  });


  try {
    const { road, neighborhood, house_number, city, state, country, cep } =
      bodySchema.parse(request.body);

    const { id } = paransSchema.parse(request.params);

    const addressRepository = new PrismaAddressRepository();
    const updateAddress = new UpdateAddressUseCase(addressRepository);

    const address = await updateAddress.execute(id, {
      road,
      neighborhood,
      house_number,
      city,
      state,
      country,
      cep,
    })

    return reply.status(200).send({
      address,
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
