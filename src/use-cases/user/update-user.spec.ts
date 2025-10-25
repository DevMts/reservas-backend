import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAddressRepository } from "@/repository/in-memory-repository/in-memory-address-repository";
import { InMemoryUserRepository } from "../../repository/in-memory-repository/in-memory-user-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { UpdateUserUseCase } from "./update-user";

describe("Update User Use Case", () => {
  let userRepository: InMemoryUserRepository;
  let addressRepository: InMemoryAddressRepository;
  let sut: UpdateUserUseCase;

  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository();
    userRepository = new InMemoryUserRepository(addressRepository);
    sut = new UpdateUserUseCase(userRepository);
  });

  it("should be able to update a user", async () => {
    const createdUser = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "999999999",
    });

    const { user } = await sut.execute(createdUser.id, {
      name: "John Doe Updated",
    });

    expect(user?.name).toEqual("John Doe Updated");
    expect(user?.email).toEqual("john.doe@example.com");
  });

  it("should not be able to update a user that does not exist", async () => {
    await expect(
      sut.execute("non-existing-id", {
        name: "John Doe Updated",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update email to an existing one", async () => {
    await userRepository.create({
      name: "User One",
      email: "user.one@example.com",
      cpf: "111.111.111-11",
      date_birth: new Date(),
      ddd: "11",
      phone: "111111111",
    });

    const userTwo = await userRepository.create({
      name: "User Two",
      email: "user.two@example.com",
      cpf: "222.222.222-22",
      date_birth: new Date(),
      ddd: "22",
      phone: "222222222",
    });

    await expect(
      sut.execute(userTwo.id, {
        email: "user.one@example.com",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should not be able to update cpf to an existing one", async () => {
    await userRepository.create({
      name: "User One",
      email: "user.one@example.com",
      cpf: "111.111.111-11",
      date_birth: new Date(),
      ddd: "11",
      phone: "111111111",
    });

    const userTwo = await userRepository.create({
      name: "User Two",
      email: "user.two@example.com",
      cpf: "222.222.222-22",
      date_birth: new Date(),
      ddd: "22",
      phone: "222222222",
    });

    await expect(
      sut.execute(userTwo.id, {
        cpf: "111.111.111-11",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should be able to update email if it is the user's own email", async () => {
    const createdUser = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "999999999",
    });

    const { user } = await sut.execute(createdUser.id, {
      email: "john.doe@example.com",
    });

    expect(user?.email).toEqual("john.doe@example.com");
  });
});
