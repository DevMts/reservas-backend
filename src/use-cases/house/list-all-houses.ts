import type { HouseRepository } from "@/repository/house-repository";

export class ListAllHousesUseCase {
  constructor(private houseRepository: HouseRepository) { }

  async execute() {
    const houses = await this.houseRepository.findMany();
    return houses;
  }
}
