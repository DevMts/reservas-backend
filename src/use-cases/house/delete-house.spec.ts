import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Address } from "@/repository/address-repository";
import type { House } from "@/repository/house-repository";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { DeleteHouseUseCase } from "./delete-house";

describe("Delete House Use Case", () => {
  let houseRepository: InMemoryHouseRepository;
  let addressRepository: InMemoryAddressRepository;
  let sut: DeleteHouseUseCase;
  let house: House;
  let address: Address;

  beforeEach(async () => {
    houseRepository = new InMemoryHouseRepository();
    addressRepository = new InMemoryAddressRepository();
    sut = new DeleteHouseUseCase(houseRepository, addressRepository);

    // Criar dados de teste
    address = await addressRepository.create({
      road: "Rua Teste",
      city: "Cidade Teste",
      state: "TS",
      cep: "12345-678",
      country: "Brasil",
      neighborhood: "Bairro Teste",
      house_number: "123",
    });

    house = await houseRepository.create({
      price: 200,
      description: "Casa de teste para exclusão",
      id_owner: "owner-01",
      id_address: address.id,
    });
  });

  it("should be able to delete a house and its associated address", async () => {
    const result = await sut.execute(house.id);

    expect(result).toEqual({
      message: "House and associated address deleted successfully",
    });

    const deletedHouse = await houseRepository.findById(house.id);
    const deletedAddress = await addressRepository.findById(address.id);

    expect(deletedHouse).toBeNull();
    expect(deletedAddress).toBeNull();
  });

  it("should throw an error if the house does not exist", async () => {
    await expect(sut.execute("non-existing-id")).rejects.toThrow(
      "House not found",
    );
  });

  it("should throw an error if it fails to delete the house", async () => {
    // Simular falha na exclusão da casa
    vi.spyOn(houseRepository, "delete").mockResolvedValueOnce(false);

    await expect(sut.execute(house.id)).rejects.toThrow(
      "Failed to delete house",
    );

    // Garantir que o endereço não foi excluído
    const existingAddress = await addressRepository.findById(address.id);
    expect(existingAddress).not.toBeNull();
  });

  it("should throw an error if it fails to delete the address", async () => {
    // Simular falha na exclusão do endereço
    vi.spyOn(addressRepository, "delete").mockResolvedValueOnce(false);

    await expect(sut.execute(house.id)).rejects.toThrow(
      "Failed to delete address",
    );

    // O ideal seria que a transação fosse revertida, mas como não há
    // transação explícita, a casa pode ter sido excluída.
    // Este teste verifica o comportamento atual.
    const deletedHouse = await houseRepository.findById(house.id);
    const existingAddress = await addressRepository.findById(address.id);

    expect(deletedHouse).toBeNull(); // A casa foi excluída
    expect(existingAddress).not.toBeNull(); // O endereço não foi
  });
});
