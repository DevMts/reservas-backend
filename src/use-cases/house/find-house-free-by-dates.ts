import type { HouseRepository } from "@/repository/house-repository";
import { InvalidDateRangeError } from "../errors/invalid-date-range-error";

export class FindHouseFreeByDatesUseCase {
  constructor(private houseRepository: HouseRepository) { }

  async execute(check_in: Date, check_out: Date) {
    if (check_in >= check_out) {
      throw new InvalidDateRangeError();
    }

    const houses = await this.houseRepository.findByDatesFree(check_in, check_out)

    return houses
  }
}
