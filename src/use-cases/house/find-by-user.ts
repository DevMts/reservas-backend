import type { HouseRepository } from "@/repository/house-repository";

export class FindHouseByUserUseCase {
  constructor(
    private houseRepository: HouseRepository,
  ) { }
  async execute(id?: string | undefined, name?: string | undefined) {


    const house = await this.houseRepository.findByUser(id, name);

    return house;
  }
}
