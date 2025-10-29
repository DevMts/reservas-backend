import { beforeEach, describe, expect, it, vi } from "vitest";
import type { House } from "@/repository/house-repository";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { InMemoryRentalRepository } from "@/repository/in-memory-repository/in-memory-rental-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import type { Rental } from "@/repository/rental-repository";
import type { User } from "@/repository/user-repository";
import { UpdateRentalUseCase } from "./update-rental";

describe("Update Rental Use Case", () => {
  let rentalRepository: InMemoryRentalRepository;
  let houseRepository: InMemoryHouseRepository;
  let userRepository: InMemoryUserRepository;
  let addressRepository: InMemoryAddressRepository;
  let sut: UpdateRentalUseCase;
  let user: User;
  let house: House;
  let createdRental: Rental;

  beforeEach(async () => {
    rentalRepository = new InMemoryRentalRepository();
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    houseRepository = new InMemoryHouseRepository(
      addressRepository,
      userRepository,
    );
    sut = new UpdateRentalUseCase(rentalRepository);

    user = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "12345678900",
      date_birth: new Date(),
      ddd: "11",
      phone: "999999999",
    });
    house = await houseRepository.create({
      description: "A nice house",
      price: 100,
      id_address: "address-1",
      id_owner: "owner-1",
    });

    createdRental = await rentalRepository.create({
      user: user.id,
      house: house.id,
      check_in: new Date("2024-07-01"),
      check_out: new Date("2024-07-10"),
    });
  });

  it("should be able to update a rental", async () => {
    const updateData = {
      check_in: new Date("2024-07-02"),
      check_out: new Date("2024-07-11"),
    };

    const updatedRental = await sut.execute(createdRental.id, updateData);

    expect(updatedRental).not.toBeNull();
    expect(updatedRental?.id).toBe(createdRental.id);
    expect(updatedRental?.check_in).toEqual(new Date("2024-07-02"));
    expect(updatedRental?.check_out).toEqual(new Date("2024-07-11"));
    expect(updatedRental?.updatedAt.getTime()).toBeGreaterThanOrEqual(
      createdRental.updatedAt.getTime(),
    );
  });

  it("should throw an error if the rental does not exist", async () => {
    await expect(
      sut.execute("non-existing-id", {
        check_in: new Date("2024-08-01"),
      }),
    ).rejects.toThrow("Rental not found");
  });

  it("should throw an error if check-out date is not after check-in date", async () => {
    const updateData = {
      check_in: new Date("2024-07-15"),
      check_out: new Date("2024-07-14"),
    };

    await expect(sut.execute(createdRental.id, updateData)).rejects.toThrow(
      "Check-out date must be after check-in date",
    );

    const sameDayUpdateData = {
      check_in: new Date("2024-07-15"),
      check_out: new Date("2024-07-15"),
    };

    await expect(
      sut.execute(createdRental.id, sameDayUpdateData),
    ).rejects.toThrow("Check-out date must be after check-in date");
  });

  it("should return null if the repository fails to update", async () => {
    vi.spyOn(rentalRepository, "update").mockResolvedValueOnce(null);

    const result = await sut.execute(createdRental.id, {
      check_in: new Date("2024-07-02"),
    });

    expect(result).toBeNull();
  });
});
