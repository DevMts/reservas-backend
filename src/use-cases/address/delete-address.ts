import type { AddressRepository } from "../../repository/address-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export class DeleteAddressUseCase {
  constructor(private addressRepository: AddressRepository) { }

  async execute(id: string) {
    const addressExists = await this.addressRepository.findById(id);
    if (!addressExists) {
      throw new ResourceNotFoundError();
    }
    await this.addressRepository.delete(id);
  }
}
