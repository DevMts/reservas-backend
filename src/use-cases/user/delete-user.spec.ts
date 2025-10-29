import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryUserRepository } from "../../repository/in-memory-repository/in-memory-user-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { DeleteUserUseCase } from "./delete-user";

describe("Delete User Use Case", () => {
  let userRepository: InMemoryUserRepository;
  let addressRepository: InMemoryAddressRepository;
  let sut: DeleteUserUseCase;

  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    sut = new DeleteUserUseCase(userRepository);
  });

  it("should be able to delete a user", async () => {
    const createdUser = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "999999999",
    });

    await sut.execute(createdUser.id);

    const user = await userRepository.findById(createdUser.id);

    expect(user).toBeNull();
  });

  it("should not be able to delete a user that does not exist", async () => {
    await expect(sut.execute("non-existing-id")).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});
