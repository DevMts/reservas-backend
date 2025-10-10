import type { HouseRepository } from "@/repository/house-repository";
import type { RentalRepository } from "@/repository/rental-repository";
import { HouseNotFoundError } from "../errors/house-not-found-error";

export class FindRentalByHouseUseCase {
  constructor(
    private rentalRepository: RentalRepository,
    private houseRepository: HouseRepository,
  ) { }

  async execute(id: string) {
    const isHouseExist = await this.houseRepository.findById(id)

    if (!isHouseExist) {
      throw new HouseNotFoundError()
    }

    const rentals = await this.rentalRepository.findByHouseId(id);

    return rentals
  }
}
