import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { CreateAddressUseCase } from "../address/create-address";
import { CreateHouseUseCase } from "./create-house";

describe("Create House Use Case", () => {
  let houseRepository: InMemoryHouseRepository;
  let addressRepository: InMemoryAddressRepository;
  let sut: CreateHouseUseCase;
  let createdAddress: CreateAddressUseCase;

  beforeEach(() => {
    houseRepository = new InMemoryHouseRepository();
    sut = new CreateHouseUseCase(houseRepository);
    addressRepository = new InMemoryAddressRepository();
    createdAddress = new CreateAddressUseCase(addressRepository);
  });

  it("should be able to create a new house", async () => {
    const { address } = await createdAddress.execute({
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
      id_owner: "owner-01",
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
});
