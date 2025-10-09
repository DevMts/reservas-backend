import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import { CreateHouseUseCase } from "./create-house";

describe("Create House Use Case", () => {
  let houseRepository: InMemoryHouseRepository;
  let addressRepository: InMemoryAddressRepository;
  let userRepository: InMemoryUserRepository;
  let sut: CreateHouseUseCase;

  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    houseRepository = new InMemoryHouseRepository(addressRepository, userRepository);
    sut = new CreateHouseUseCase(
      houseRepository,
      userRepository,
      addressRepository,
    );
  });

  it("should be able to create a new house", async () => {
    const address = await addressRepository.create({
      road: "Av. Paulista",
      city: "São Paulo",
      state: "SP",
      cep: "01311-200",
      country: "Brasil",
      neighborhood: "Bela Vista",
      house_number: "123",
    });

    const user = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "99999-9999",
      id_address: address.id,
    });

    const houseData = {
      price: 150.5,
      description: "A beautiful house near the beach",
      id_owner: user.id,
      id_address: address.id,
    };

    const house = await sut.execute(houseData);

    expect(house.id).toEqual(expect.any(String));
    expect(house.id).toHaveLength(36); // UUID length
    expect(house.price).toBe(150.5);
    expect(house.description).toBe("A beautiful house near the beach");
    expect(house.createdAt).toBeInstanceOf(Date);
    expect(house.updatedAt).toBeInstanceOf(Date);

    // Verifica se foi salvo no repositório
    const savedHouse = await houseRepository.findById(house.id);
    expect(savedHouse).toEqual(house);
  });

  it("should not be able to create a house with a non-existing user", async () => {
    const address = await addressRepository.create({
      road: "Av. Paulista",
      city: "São Paulo",
      state: "SP",
      cep: "01311-200",
      country: "Brasil",
      neighborhood: "Bela Vista",
      house_number: "123",
    });

    const houseData = {
      price: 150.5,
      description: "A beautiful house near the beach",
      id_owner: "non-existing-user-id",
      id_address: address.id,
    };

    await expect(sut.execute(houseData)).rejects.toThrow("User not found");
  });

  it("should not be able to create a house with a non-existing address", async () => {

    const user = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "99999-9999",
    });

    const houseData = {
      price: 150.5,
      description: "A beautiful house near the beach",
      id_owner: user.id,
      id_address: "non-existing-address-id",
    };

    await expect(sut.execute(houseData)).rejects.toThrow("Address not found");
  });
});
