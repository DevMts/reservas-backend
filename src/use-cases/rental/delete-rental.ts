import type { RentalRepository } from "@/repository/rental-repository";

export class DeleteRentalUseCase {
  constructor(private rentalRepository: RentalRepository) { }

  async execute(id: string): Promise<void> {
    const rental = await this.rentalRepository.findById(id);
    if (!rental) {
      throw new Error("Rental not found");
    }

    await this.rentalRepository.delete(id);
  }
}
