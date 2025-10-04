import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Address } from "@/repository/address-repository";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import type { User } from "@/repository/user-repository";
import { AddAddressForUserProfileCase } from "./add-address-for-user";

describe("Add Address for User Profile Use Case", () => {
  let userRepository: InMemoryUserRepository;
  let addressRepository: InMemoryAddressRepository;
  let sut: AddAddressForUserProfileCase;
  let user: User;
  let address: Address;

  beforeEach(async () => {
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    sut = new AddAddressForUserProfileCase(userRepository, addressRepository);

    // Create a base user and address for tests
    user = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
    });

    address = await addressRepository.create({
      cep: "12345-678",
      road: "Test Street",
      neighborhood: "Test Neighborhood",
      house_number: "123",
      city: "Test City",
      state: "TS",
      country: "Testland",
    });
  });

  it("should be able to add an address to a user profile", async () => {
    const updatedUser = await sut.execute(user.id, address.id);

    expect(updatedUser.id_address).toBe(address.id);

    const userInDb = await userRepository.findById(user.id); // Verifica se o usuário foi atualizado no "banco de dados"
    expect(userInDb?.id_address).toBe(address.id);
  });

  it("should throw an error if the user is not found", async () => {
    const nonExistentUserId = "non-existent-user-id";

    await expect(sut.execute(nonExistentUserId, address.id)).rejects.toThrow(
      "User not found",
    );
  });

  it("should throw an error if the address is not found", async () => {
    const nonExistentAddressId = "non-existent-address-id";

    await expect(sut.execute(user.id, nonExistentAddressId)).rejects.toThrow(
      "Address not found",
    );
  });

  it("should throw an error if the user update fails", async () => {
    // Mock the update method to simulate a failure
    vi.spyOn(userRepository, "addAddress").mockResolvedValueOnce(null);

    await expect(sut.execute(user.id, address.id)).rejects.toThrow(
      "Failed to add address to user profile",
    );
  });

  it("should not change other user properties", async () => {
    const originalName = user.name;
    const originalEmail = user.email;

    const updatedUser = await sut.execute(user.id, address.id);

    expect(updatedUser.name).toBe(originalName);
    expect(updatedUser.email).toBe(originalEmail);
  });
});
