import type {
  FindByAddressData,
  HouseRepository,
} from "@/repository/house-repository";

export class FindHouseByAddressUseCase {
  constructor(private houseRepository: HouseRepository) { }
  async execute(data: FindByAddressData) {
    if (Object.values(data).every((value) => value === undefined)) {
      throw new Error("At least one address field must be provided for search.");
    }
    const house = await this.houseRepository.findByAddress(data);
    return house;
  }
}

