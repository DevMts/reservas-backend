import { beforeEach, describe, expect, it } from "vitest";
import type { AddressRepository } from "../repository/address-repository";
import { InMemoryAddressRepository } from "../repository/in-memory-repository/in-memory-address-repository";
import { CreateAddressUseCase } from "./create-address";

describe("Create Address Use Case", () => {
  let addressRepository: AddressRepository;
  let createAddressUseCase: CreateAddressUseCase;

  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository();
    createAddressUseCase = new CreateAddressUseCase(addressRepository);
  });

  it("should create a new address", async () => {
    const { address } = await createAddressUseCase.execute({
      road: "Rua dos Bobos",
      city: "São Paulo",
      state: "SP",
      cep: "01000-000",
      neighborhood: "Centro",
      house_number: "0",
      country: "Brasil",
    });

    expect(address.id).toEqual(expect.any(String));
    expect(address.road).toBe("Rua dos Bobos");
  });

  it("should throw an error if street is not provided", async () => {
    await expect(
      createAddressUseCase.execute({
        road: "",
        city: "São Paulo",
        state: "SP",
        cep: "01000-000",
        neighborhood: "Centro",
        house_number: "0",
        country: "Brasil",
      }),
    ).rejects.toThrow("Street is required");
  });

  it("should throw an error if city is not provided", async () => {
    await expect(
      createAddressUseCase.execute({
        road: "Rua dos Bobos",
        city: "",
        state: "SP",
        cep: "01000-000",
        neighborhood: "Centro",
        house_number: "0",
        country: "Brasil",
      }),
    ).rejects.toThrow("City is required");
  });

  it("should throw an error if state is not provided", async () => {
    await expect(
      createAddressUseCase.execute({
        road: "Rua dos Bobos",
        city: "São Paulo",
        state: "",
        cep: "01000-000",
        neighborhood: "Centro",
        house_number: "0",
        country: "Brasil",
      }),
    ).rejects.toThrow("State is required");
  });

  it("should throw an error if zip code is not provided", async () => {
    await expect(
      createAddressUseCase.execute({
        road: "Rua dos Bobos",
        city: "São Paulo",
        state: "SP",
        cep: "",
        neighborhood: "Centro",
        house_number: "0",
        country: "Brasil",
      }),
    ).rejects.toThrow("Zip code is required");
  });
});
