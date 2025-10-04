import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import { CreateAddressUseCase } from "../address/create-address";
import { ListUserAndAddressByIdUseCase } from "./list-user-and-address-by-id";

let userRepository: InMemoryUserRepository;
let sut: ListUserAndAddressByIdUseCase;
let addressRepo: InMemoryAddressRepository;
let sutAddress: CreateAddressUseCase;

describe("List User And Address By Id Use Case", () => {
  beforeEach(() => {
    addressRepo = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepo);
    sut = new ListUserAndAddressByIdUseCase(userRepository);
    sutAddress = new CreateAddressUseCase(addressRepo);
  });

  it("should be able to list a user with their address", async () => {
    const address = {
      id: "address-1",
      cep: "12345-678",
      road: "Test Street",
      neighborhood: "Test Neighborhood",
      house_number: "123",
      city: "Test City",
      state: "TS",
      country: "Testland",
    };
    sutAddress.execute(address);

    const createdUser = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      id_address: "address-1",
    });

    const userWithAddress = await sut.execute(createdUser.id);

    expect(userWithAddress).not.toBeNull();
    expect(userWithAddress?.user.id).toEqual(createdUser.id);
    expect(userWithAddress).toHaveProperty("address");
    expect(userWithAddress?.address?.id).toEqual(address.id);
  });

  it("should throw an error if user is not found", async () => {
    await expect(sut.execute("non-existing-id")).rejects.toThrowError(
      "User not found",
    );
  });

  it("should return user without address if address is not linked", async () => {
    const createdUser = await userRepository.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
    });

    const userWithAddress = await sut.execute(createdUser.id);

    expect(userWithAddress).not.toBeNull();
    expect(userWithAddress?.user.id).toEqual(createdUser.id);
    expect(userWithAddress).toHaveProperty("address");
    expect(userWithAddress?.address).toBeNull();
  });
});
