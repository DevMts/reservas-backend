import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "../../repository/in-memory-repository/in-memory-address-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UpdateAddressUseCase } from "./update-address";

describe("Update Address Use Case", () => {
  let addressRepository: InMemoryAddressRepository;
  let sut: UpdateAddressUseCase;

  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository();
    sut = new UpdateAddressUseCase(addressRepository);
  });

  it("should be able to update an address", async () => {
    const createdAddress = await addressRepository.create({
      road: "Rua dos Bobos",
      city: "São Paulo",
      state: "SP",
      cep: "01000-000",
      neighborhood: "Centro",
      house_number: "0",
      country: "Brasil",
    });

    const { address } = await sut.execute(createdAddress.id, {
      road: "Rua dos Espertos",
    });

    expect(address?.road).toEqual("Rua dos Espertos");
    expect(address?.city).toEqual("São Paulo");
  });

  it("should not be able to update an address that does not exist", async () => {
    await expect(
      sut.execute("non-existing-id", {
        road: "Rua dos Espertos",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});