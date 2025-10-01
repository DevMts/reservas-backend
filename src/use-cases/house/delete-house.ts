import type { AddressRepository } from "@/repository/address-repository";
import type { HouseRepository } from "@/repository/house-repository";

export class DeleteHouseUseCase {
  constructor(
    private houseRepository: HouseRepository,
    private addressRepository: AddressRepository,
  ) { }

  async execute(id: string) {
    const house = await this.houseRepository.findById(id);
    if (!house) {
      throw new Error("House not found");
    }

    const addressId = house.id_address;

    const houseDeleted = await this.houseRepository.delete(id);
    if (!houseDeleted) {
      throw new Error("Failed to delete house");
    }

    const addressDeleted = await this.addressRepository.delete(addressId);
    if (!addressDeleted) {
      throw new Error("Failed to delete address");
    }

    return { message: "House and associated address deleted successfully" };
  }
}
