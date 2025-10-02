import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRentalRepository } from "@/repository/in-memory-repository/in-memory-rental-repository";
import type { Rental } from "@/repository/rental-repository";
import { ListAllRentalsUseCase } from "./list-all-rentals";

describe("List All Rentals Use Case", () => {
  let rentalRepository: InMemoryRentalRepository;
  let sut: ListAllRentalsUseCase;

  // No pagination tests
  beforeEach(() => {
    rentalRepository = new InMemoryRentalRepository();
    sut = new ListAllRentalsUseCase(rentalRepository);
  });

  it("should be able to list all registered rentals", async () => {
    const rental1 = await rentalRepository.create({
      user: "user-01",
      house: "house-01",
      check_in: new Date("2024-01-01"),
      check_out: new Date("2024-01-05"),
    });

    const rental2 = await rentalRepository.create({
      user: "user-02",
      house: "house-02",
      check_in: new Date("2024-02-01"),
      check_out: new Date("2024-02-05"),
    });

    const { rentals } = await sut.execute();

    expect(rentals).toHaveLength(2);
    expect(rentals).toEqual([rental1, rental2]);
  });

  it("should return an empty array when there are no rentals", async () => {
    const { rentals } = await sut.execute();

    expect(rentals).toHaveLength(0);
    expect(rentals).toEqual([]);
  });

  // Pagination tests
  describe("with pagination", () => {
    const createdRentals: Rental[] = [];

    beforeEach(async () => {
      // Create 25 rentals for pagination tests
      for (let i = 1; i <= 25; i++) {
        const rental = await rentalRepository.create({
          user: `user-${i}`,
          house: `house-${i}`,
          check_in: new Date(`2024-01-${i < 10 ? "0" : ""}${i}`),
          check_out: new Date(`2024-01-${i < 10 ? "0" : ""}${i + 1}`),
        });
        createdRentals.push(rental);
      }
    });

    it("should be able to list paginated rentals (page 1)", async () => {
      const { rentals } = await sut.execute(1, 10);

      expect(rentals).toHaveLength(10);
      expect(rentals[0].id_user).toBe("user-1");
      expect(rentals[9].id_user).toBe("user-10");
    });

    it("should be able to list paginated rentals (page 2)", async () => {
      const { rentals } = await sut.execute(2, 10);

      expect(rentals).toHaveLength(10);
      expect(rentals[0].id_user).toBe("user-11");
      expect(rentals[9].id_user).toBe("user-20");
    });

    it("should be able to list the last page with remaining items", async () => {
      const { rentals } = await sut.execute(3, 10);

      expect(rentals).toHaveLength(5);
      expect(rentals[0].id_user).toBe("user-21");
      expect(rentals[4].id_user).toBe("user-25");
    });

    it("should return an empty array for a page out of bounds", async () => {
      const { rentals } = await sut.execute(4, 10);

      expect(rentals).toHaveLength(0);
    });
  });
});
