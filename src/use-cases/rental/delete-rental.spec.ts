import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRentalRepository } from "@/repository/in-memory-repository/in-memory-rental-repository";
import type { Rental } from "@/repository/rental-repository";
import { DeleteRentalUseCase } from "./delete-rental";

describe("Delete Rental Use Case", () => {
  let rentalRepository: InMemoryRentalRepository;
  let sut: DeleteRentalUseCase;
  let createdRental: Rental;

  beforeEach(async () => {
    rentalRepository = new InMemoryRentalRepository();
    sut = new DeleteRentalUseCase(rentalRepository);

    // Create a rental to be used in the tests
    createdRental = await rentalRepository.create({
      user: "user-01",
      house: "house-01",
      check_in: new Date("2024-08-01"),
      check_out: new Date("2024-08-10"),
    });

    // Create another rental to ensure we only delete the correct one
    await rentalRepository.create({
      user: "user-02",
      house: "house-02",
      check_in: new Date("2024-09-01"),
      check_out: new Date("2024-09-10"),
    });
  });

  it("should be able to delete a rental", async () => {
    await sut.execute(createdRental.id);

    const deletedRental = await rentalRepository.findById(createdRental.id);

    expect(deletedRental).toBeNull();
    expect(rentalRepository.items).toHaveLength(1);
    expect(rentalRepository.items[0].id_user).toBe("user-02");
  });

  it("should throw an error if the rental does not exist", async () => {
    const nonExistingId = "non-existing-id";

    await expect(sut.execute(nonExistingId)).rejects.toThrow(
      "Rental not found",
    );

    expect(rentalRepository.items).toHaveLength(2);
  });
});
