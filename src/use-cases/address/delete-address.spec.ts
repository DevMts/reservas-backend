import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "../../repository/in-memory-repository/in-memory-address-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeleteAddressUseCase } from "./delete-address";

describe("Delete Address Use Case", () => {
  let addressRepository: InMemoryAddressRepository;
  let sut: DeleteAddressUseCase;

  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository();
    sut = new DeleteAddressUseCase(addressRepository);
  });

  it("should be able to delete an address", async () => {
    const createdAddress = await addressRepository.create({
      road: "Rua Teste",
      city: "Cidade Teste",
      state: "TS",
      cep: "12345-678",
      neighborhood: "Bairro Teste",
      house_number: "123",
      country: "Brasil",
    });

    await sut.execute(createdAddress.id);

    const address = await addressRepository.findById(createdAddress.id);

    expect(address).toBeNull();
  });

  it("should not be able to delete an address that does not exist", async () => {
    await expect(sut.execute("non-existing-id")).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});
