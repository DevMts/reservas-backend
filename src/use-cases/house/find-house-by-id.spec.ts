import { beforeEach, describe, expect, it } from "vitest";
import type { House } from "@/repository/house-repository";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import { FindHouseByIdUseCase } from "./find-house-by-id";

describe("Find House By Id Use Case", () => {
  let houseRepository: InMemoryHouseRepository;
  let addressRepository: InMemoryAddressRepository;
  let userRepository: InMemoryUserRepository;
  let sut: FindHouseByIdUseCase;
  let createdHouse: House;

  beforeEach(async () => {
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    houseRepository = new InMemoryHouseRepository(
      addressRepository,
      userRepository,
    );
    sut = new FindHouseByIdUseCase(houseRepository);

    // Criar uma casa para os testes
    createdHouse = await houseRepository.create({
      price: 250.0,
      description: "A cozy house in the mountains",
      id_owner: "owner-01",
      id_address: "address-01",
    });
  });

  it("should be able to find a house by its id", async () => {
    const house = await sut.execute(createdHouse.id);

    expect(house).toEqual(createdHouse);
    expect(house.id).toBe(createdHouse.id);
  });

  it("should throw an error if the house does not exist", async () => {
    await expect(sut.execute("non-existing-id")).rejects.toThrow(
      "House not found",
    );
  });
});
