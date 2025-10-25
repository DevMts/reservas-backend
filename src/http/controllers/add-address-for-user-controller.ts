import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { PrismaAddressRepository } from "@/repository/prisma/prisma-address-repository";
import { PrismaUserRepository } from "@/repository/prisma/prisma-user-repository";
import { AddAddressForUserProfileCase } from "@/use-cases/user/add-address-for-user";

export async function AddAddressForUserProfileController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z.object({
    userId: z.string(),
    addressId: z.string(),
  });
  try {
    const { userId, addressId } = bodySchema.parse(request.body);

    const userRepository = new PrismaUserRepository();
    const addressRepository = new PrismaAddressRepository();
    const addAddressForUserProfile = new AddAddressForUserProfileCase(
      userRepository,
      addressRepository,
    );


    const isUserExisting = await userRepository.findById(userId);
    if (!isUserExisting) {
      return reply.status(404).send({
        message: "User not found",
      });
    }

    const isAddressExisting = await addressRepository.findById(addressId);
    if (!isAddressExisting) {
      return reply.status(404).send({
        message: "Address not found",
      });
    }

    const updatedUser = await addAddressForUserProfile.execute(
      userId,
      addressId,
    );

    return reply.status(200).send({
      message: "Address added successfully",
      updatedUser,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return reply.status(400).send({
        error: "Validation error",
        details: error.message,
      });
    }
    if (error instanceof Error) {
      console.log(error);
      return reply.status(400).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Internal server error" });
  }
}
