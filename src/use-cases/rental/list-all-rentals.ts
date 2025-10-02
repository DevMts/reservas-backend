import type { Rental, RentalRepository } from "@/repository/rental-repository";

export class ListAllRentalsUseCase {
  constructor(private rentalRepository: RentalRepository) { }

  async execute(page?: number, limit?: number): Promise<{ rentals: Rental[] }> {

    const rentals = await this.rentalRepository.findMany();
    if (page && limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedRentals = rentals.slice(startIndex, endIndex);

      return { rentals: paginatedRentals };
    }

    return { rentals };
  }
}
