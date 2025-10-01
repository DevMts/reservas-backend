import type { House, HouseRepository } from "@/repository/house-repository";

export class UpdateHouseUseCase {
  constructor(private houseRepository: HouseRepository) { }

  async execute(id: string, data: Partial<House>): Promise<House | null> {
    const house = await this.houseRepository.findById(id);
    if (!house) {
      throw new Error("House not found");
    }

    const updatedHouse = await this.houseRepository.update(id, data);

    return updatedHouse;
  }
}
