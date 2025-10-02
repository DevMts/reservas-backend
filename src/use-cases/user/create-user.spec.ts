import { beforeEach, describe, expect, it } from "vitest";
import type { AddressRepository } from "../../repository/address-repository";
import { InMemoryAddressRepository } from "../../repository/in-memory-repository/in-memory-address-repository";
import { InMemoryUserRepository } from "../../repository/in-memory-repository/in-memory-user-repository";
import type { UserRepository } from "../../repository/user-repository";
import { CreateAddressUseCase } from "../address/create-address";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { CreateUserUseCase } from "./create-user";

describe("Create User Use Case", () => {
  let userRepository: UserRepository;
  let createUserUseCase: CreateUserUseCase;
  let addressRepository: AddressRepository;
  let createAddressUseCase: CreateAddressUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    addressRepository = new InMemoryAddressRepository();
    createAddressUseCase = new CreateAddressUseCase(addressRepository);
  });
  it("should create a new user", async () => {
    const { user } = await createUserUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "999999999",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toBe("John Doe");
  });

  it("should not be able to create a user with an existing email", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "999999999",
    });

    expect(() =>
      createUserUseCase.execute({
        name: "Jane Doe",
        email: "john.doe@example.com",
        cpf: "111.222.333-44",
        date_birth: new Date(),
        ddd: "22",
        phone: "888888888",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should not be able to create a user with an existing cpf", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "999999999",
    });

    expect(() =>
      createUserUseCase.execute({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        cpf: "123.456.789-00",
        date_birth: new Date(),
        ddd: "22",
        phone: "888888888",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should throw an error if name is not provided", async () => {
    await expect(
      createUserUseCase.execute({
        name: "",
        email: "test@test.com",
        cpf: "123",
        date_birth: new Date(),
        ddd: "22",
        phone: "888888888",
      }),
    ).rejects.toThrow("Name is required");
  });

  it("should throw an error if email is not provided", async () => {
    await expect(
      createUserUseCase.execute({
        name: "test",
        email: "",
        cpf: "123",
        date_birth: new Date(),
        ddd: "22",
        phone: "888888888",
      }),
    ).rejects.toThrow("Email is required");
  });

  it("should throw an error if cpf is not provided", async () => {
    await expect(
      createUserUseCase.execute({
        name: "test",
        email: "test@test.com",
        cpf: "",
        date_birth: new Date(),
        ddd: "22",
        phone: "888888888",
      }),
    ).rejects.toThrow("CPF is required");
  });
  it("should be able to add an address to a user", async () => {
    const { address } = await createAddressUseCase.execute({
      road: "Rua dos Bobos",
      city: "São Paulo",
      state: "SP",
      cep: "01000-000",
      neighborhood: "Centro",
      house_number: "0",
      country: "Brasil",
    });

    const { user } = await createUserUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "999999999",
      id_address: address.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.id_address).toEqual(address.id);
  });
});
