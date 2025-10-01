import type {
  House,
  HouseCreateInput,
  HouseRepository,
} from "@/repository/house-repository";

export class CreateHouseUseCase {
  constructor(private houseRepository: HouseRepository) { }

  async execute(data: HouseCreateInput): Promise<House> {
    const house = await this.houseRepository.create(data);


    return house;
  }
}
