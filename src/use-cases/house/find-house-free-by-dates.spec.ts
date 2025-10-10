import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { InMemoryRentalRepository } from "@/repository/in-memory-repository/in-memory-rental-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import { InvalidDateRangeError } from "../errors/invalid-date-range-error";
import { FindHouseFreeByDatesUseCase } from "./find-house-free-by-dates";

describe("Find House Free By Dates Use Case", () => {
  let houseRepository: InMemoryHouseRepository;
  let rentalRepository: InMemoryRentalRepository;
  let addressRepository: InMemoryAddressRepository;
  let userRepository: InMemoryUserRepository;
  let sut: FindHouseFreeByDatesUseCase;

  beforeEach(async () => {
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    rentalRepository = new InMemoryRentalRepository();
    houseRepository = new InMemoryHouseRepository(
      addressRepository,
      userRepository,
    );
    sut = new FindHouseFreeByDatesUseCase(houseRepository);

    // Create some houses
    await houseRepository.create({
      id: "house-1",
      description: "House 1",
      price: 100,
      id_address: "address-1",
      id_owner: "owner-1",
    });
    await houseRepository.create({
      id: "house-2",
      description: "House 2",
      price: 150,
      id_address: "address-2",
      id_owner: "owner-2",
    });
  });

  it("should be able to find houses free on a given date range", async () => {
    // house-1 is rented from 2025-01-10 to 2025-01-15
    await rentalRepository.create({
      house: "house-1",
      user: "user-1",
      check_in: new Date("2025-01-10"),
      check_out: new Date("2025-01-15"),
    });

    // Search for a period where house-2 is free
    const houses = await sut.execute(
      new Date("2025-01-11"),
      new Date("2025-01-14"),
    );

    expect(houses).toHaveLength(1);
    expect(houses?.[0].id).toBe("house-2");
  });

  it("should return all houses if no rentals exist for the period", async () => {
    const houses = await sut.execute(
      new Date("2025-03-01"),
      new Date("2025-03-10"),
    );

    expect(houses).toHaveLength(2);
  });

  it("should return an empty array if all houses are rented", async () => {
    await rentalRepository.create({
      house: "house-1",
      user: "user-1",
      check_in: new Date("2025-04-01"),
      check_out: new Date("2025-04-10"),
    });
    await rentalRepository.create({
      house: "house-2",
      user: "user-2",
      check_in: new Date("2025-04-01"),
      check_out: new Date("2025-04-10"),
    });

    const houses = await sut.execute(
      new Date("2025-04-02"),
      new Date("2025-04-08"),
    );

    expect(houses).toEqual([]);
  });

  it("should throw an error for an invalid date range", async () => {
    await expect(
      sut.execute(new Date("2025-01-10"), new Date("2025-01-09")),
    ).rejects.toBeInstanceOf(InvalidDateRangeError);

    await expect(
      sut.execute(new Date("2025-01-10"), new Date("2025-01-10")),
    ).rejects.toBeInstanceOf(InvalidDateRangeError);
  });

  it("should find a house available exactly between two rentals", async () => {
    await rentalRepository.create({
      house: "house-1",
      user: "user-1",
      check_in: new Date("2025-05-01"),
      check_out: new Date("2025-05-10"),
    });

    const houses = await sut.execute(
      new Date("2025-05-10"),
      new Date("2025-05-15"),
    );
    expect(houses).toHaveLength(2); // house-1 and house-2 are free
  });
});
