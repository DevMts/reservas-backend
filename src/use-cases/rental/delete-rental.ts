import type { RentalRepository } from "@/repository/rental-repository";
import { RentalNotFoundError } from "../errors/rental-not-found-error";

export class DeleteRentalUseCase {
  constructor(private rentalRepository: RentalRepository) { }

  async execute(id: string): Promise<void> {
    const rental = await this.rentalRepository.findById(id);
    if (!rental) {
      throw new RentalNotFoundError();
    }

    await this.rentalRepository.delete(id);
  }
}
