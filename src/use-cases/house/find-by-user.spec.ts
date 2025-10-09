import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import { FindHouseByUserUseCase } from "./find-by-user";

let houseRepository: InMemoryHouseRepository;
let userRepository: InMemoryUserRepository;
let addressRepository: InMemoryAddressRepository;
let sut: FindHouseByUserUseCase;

describe("Find House By User Use Case", () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    houseRepository = new InMemoryHouseRepository(addressRepository, userRepository);
    sut = new FindHouseByUserUseCase(houseRepository);
  });

  it("should be able to find houses by user id", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    await houseRepository.create({
      id_owner: user.id,
      description: "A beautiful house",
      price: 1500,
      id_address: "address-01",
    });

    await houseRepository.create({
      id_owner: user.id,
      description: "Another beautiful house",
      price: 2000,
      id_address: "address-02",
    });

    const houses = await sut.execute(user.id, user.name);

    expect(houses).not.toBeNull();
    expect(houses).toHaveLength(2);
    expect(houses?.[0].description).toEqual("A beautiful house");
  });

  it("should return null if user has no houses", async () => {
    const user = await userRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    const houses = await sut.execute(user.id);

    expect(houses).toEqual([]);
  });

  it("should throw an error if user does not exist", async () => {
    await expect(sut.execute("non-existing-user-id")).toBeNull
  });

  it("should throw an error with the correct message if user does not exist", async () => {
    try {
      await sut.execute("non-existing-user-id");
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("User not found");
      }
    }
  });
});
