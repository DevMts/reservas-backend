import type { Rental, RentalRepository } from "@/repository/rental-repository";
import { InvalidCheckOutDateError } from "../errors/invalid-check-out-date-error";
import { RentalNotFoundError } from "../errors/rental-not-found-error";

export class UpdateRentalUseCase {
  constructor(private rentalRepository: RentalRepository) { }

  async execute(id: string, data: Partial<Rental>): Promise<Rental | null> {
    const rental = await this.rentalRepository.findById(id);
    if (!rental) {
      throw new RentalNotFoundError();
    }

    if (data.check_in && data.check_out && data.check_in >= data.check_out) {
      throw new InvalidCheckOutDateError();
    }

    const updatedRental = await this.rentalRepository.update(id, data);

    return updatedRental;
  }
}
