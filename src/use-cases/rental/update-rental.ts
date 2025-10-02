import type { Rental, RentalRepository } from "@/repository/rental-repository";

export class UpdateRentalUseCase {
  constructor(private rentalRepository: RentalRepository) { }

  async execute(id: string, data: Partial<Rental>): Promise<Rental | null> {
    const rental = await this.rentalRepository.findById(id);
    if (!rental) {
      throw new Error("Rental not found");
    }

    if (data.check_in && data.check_out && data.check_in >= data.check_out) {
      throw new Error("Check-out date must be after check-in date");
    }

    const updatedRental = await this.rentalRepository.update(id, data);

    return updatedRental;
  }
}
