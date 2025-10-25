import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaAddressRepository } from "@/repository/prisma/prisma-address-repository";
import { bodySchema } from "@/schema/address-schema";
import { CreateAddressUseCase } from "@/use-cases/address/create-address";

export async function createAddressController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { cep, road, neighborhood, house_number, city, state, country } =
      bodySchema.parse(request.body);

    const addressRepository = new PrismaAddressRepository();
    const createdAddress = new CreateAddressUseCase(addressRepository);

    const { address } = await createdAddress.execute({
      cep,
      road,
      neighborhood,
      house_number,
      city,
      state,
      country,
    });

    return reply.status(201).send({
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error)
      return reply.status(400).send({
        error: "Validation error",
        details: error.message,
      });
    }
    if (error instanceof Error) {
      console.log(error)
      return reply.status(400).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Internal server error" });
  }
}
z