import { beforeEach, describe, expect, it } from "vitest";
import type { House } from "@/repository/house-repository";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { InMemoryRentalRepository } from "@/repository/in-memory-repository/in-memory-rental-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import { HouseNotFoundError } from "../errors/house-not-found-error";
import { FindRentalByHouseUseCase } from "./find-rental-by-house";

describe("Find Rental By House Use Case", () => {
  let rentalRepository: InMemoryRentalRepository;
  let houseRepository: InMemoryHouseRepository;
  let addressRepository: InMemoryAddressRepository;
  let userRepository: InMemoryUserRepository;
  let sut: FindRentalByHouseUseCase;
  let house: House;

  beforeEach(async () => {
    rentalRepository = new InMemoryRentalRepository();
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    houseRepository = new InMemoryHouseRepository(
      addressRepository,
      userRepository,
    );
    sut = new FindRentalByHouseUseCase(rentalRepository, houseRepository);

    house = await houseRepository.create({
      description: "A nice house",
      price: 100,
      id_address: "address-1",
      id_owner: "owner-1",
    });
  });

  it("should be able to find rentals by house id", async () => {
    await rentalRepository.create({
      house: house.id,
      user: "user-1",
      check_in: new Date("2025-01-01"),
      check_out: new Date("2025-01-05"),
    });

    await rentalRepository.create({
      house: house.id,
      user: "user-2",
      check_in: new Date("2025-02-01"),
      check_out: new Date("2025-02-05"),
    });

    const rentals = await sut.execute(house.id);

    expect(rentals).toHaveLength(2);
    expect(rentals[0].id_user).toBe("user-1");
    expect(rentals[1].id_user).toBe("user-2");
  });

  it("should return an empty array if no rentals are found for the house", async () => {
    const anotherHouse = await houseRepository.create({
      description: "Another nice house",
      price: 150,
      id_address: "address-2",
      id_owner: "owner-2",
    });

    await rentalRepository.create({
      house: house.id,
      user: "user-1",
      check_in: new Date("2025-01-01"),
      check_out: new Date("2025-01-05"),
    });

    const rentals = await sut.execute(anotherHouse.id);

    expect(rentals).toEqual([]);
  });

  it("should throw an error if the house does not exist", async () => {
    await expect(sut.execute("non-existing-house-id")).rejects.toBeInstanceOf(
      HouseNotFoundError,
    );
  });
});
