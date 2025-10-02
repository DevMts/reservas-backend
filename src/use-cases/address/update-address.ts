import type { Address, AddressRepository } from "../../repository/address-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export class UpdateAddressUseCase {
  constructor(private addressRepository: AddressRepository) { }

  async execute(id: string, data: Partial<Address>) {
    const addressExists = await this.addressRepository.findById(id);
    if (!addressExists) {
      throw new ResourceNotFoundError();
    }
    const address = await this.addressRepository.update(id, data);
    return { address };
  }
}
