import type { HouseRepository } from "@/repository/house-repository";

export class FindHouseByIdUseCase {
  constructor(private houseRepository: HouseRepository) { }

  async execute(id: string) {
    const house = await this.houseRepository.findById(id);

    if (!house) {
      throw new Error("House not found");
    }

    return house;
  }
}
