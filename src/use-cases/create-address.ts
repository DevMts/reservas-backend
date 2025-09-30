import type { Prisma } from "@prisma/client";
import type { AddressRepository } from "../repository/address-repository";

export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) { }

  async execute(data: Prisma.AddressCreateInput) {
    if (!data.road) {
      throw new Error("Street is required");
    }
    if (!data.city) {
      throw new Error("City is required");
    }
    if (!data.state) {
      throw new Error("State is required");
    }
    if (!data.cep) {
      throw new Error("Zip code is required");
    }

    const address = await this.addressRepository.create(data);
    return { address };
  }
}
