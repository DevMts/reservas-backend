import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import { FindHouseByAddressUseCase } from "./find-house-by-address";

let houseRepository: InMemoryHouseRepository;
let userRepository: InMemoryUserRepository;
let addressRepository: InMemoryAddressRepository;
let sut: FindHouseByAddressUseCase;

describe("Find House By Address Use Case", () => {
  beforeEach(async () => {
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    houseRepository = new InMemoryHouseRepository(
      addressRepository,
      userRepository,
    );
    sut = new FindHouseByAddressUseCase(houseRepository);

    // --- Setup Data ---
    const user = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    const address1 = await addressRepository.create({
      road: "Main Street",
      city: "Anytown",
      state: "CA",
      cep: "12345",
      country: "USA",
      neighborhood: "Downtown",
      house_number: "101",
    });

    const address2 = await addressRepository.create({
      road: "Second Avenue",
      city: "Anytown",
      state: "CA",
      cep: "54321",
      country: "USA",
      neighborhood: "Uptown",
      house_number: "202",
    });

    await houseRepository.create({
      id_owner: user.id,
      description: "Cozy Downtown Apartment",
      price: 1200,
      id_address: address1.id,
    });

    await houseRepository.create({
      id_owner: user.id,
      description: "Spacious Uptown Loft",
      price: 2500,
      id_address: address2.id,
    });
  });

  it("should be able to find houses by city", async () => {
    const houses = await sut.execute({ city: "Anytown" });

    expect(houses).not.toBeNull();
    expect(houses).toHaveLength(2);
  });

  it("should be able to find a specific house by its full address", async () => {
    const houses = await sut.execute({
      road: "Main Street",
      city: "Anytown",
      state: "CA",
      cep: "12345",
      country: "USA",
      neighborhood: "Downtown",
    });

    expect(houses).not.toBeNull();
    expect(houses).toHaveLength(1);
    expect(houses?.[0].description).toEqual("Cozy Downtown Apartment");
  });

  it("should return an empty array if no houses match the address criteria", async () => {
    const houses = await sut.execute({ city: "Ghost Town" });

    expect(houses).toBeNull();
  });

  it("should throw an error if no address fields are provided for search", async () => {
    await expect(sut.execute({})).rejects.toThrow(
      "At least one address field must be provided for search.",
    );
  });
});
