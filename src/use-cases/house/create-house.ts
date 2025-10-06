import type { AddressRepository } from "@/repository/address-repository";
import type {
  House,
  HouseCreateInput,
  HouseRepository,
} from "@/repository/house-repository";
import type { UserRepository } from "@/repository/user-repository";

export class CreateHouseUseCase {
  constructor(
    private houseRepository: HouseRepository,
    private userRepository: UserRepository,
    private addressRepository: AddressRepository,
  ) { }
  async execute(data: HouseCreateInput): Promise<House> {
    const userExists = await this.userRepository.findById(data.id_owner);
    if (!userExists) {
      throw new Error("User not found");
    }
    const addressExists = await this.addressRepository.findById(data.id_address);
    if (!addressExists) {
      throw new Error("Address not found");
    }
    const houseExists = await this.houseRepository.findByAddressId(data.id_address);
    if (houseExists) {
      throw new Error("House already exists for this address");
    }

    const house = await this.houseRepository.create(data);

    return house;
  }
}
