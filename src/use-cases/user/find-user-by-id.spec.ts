import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUserRepository } from "../../repository/in-memory-repository/in-memory-user-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { FindByIdUseCase } from "./find-user-by-id";

describe("Find User By Id Use Case", () => {
  let userRepository: InMemoryUserRepository;
  let sut: FindByIdUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new FindByIdUseCase(userRepository);
  });

  it("should be able to find a user by id", async () => {
    const createdUser = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "123.456.789-00",
      date_birth: new Date(),
      ddd: "11",
      phone: "999999999",
    });

    const { user } = await sut.execute(createdUser.id);

    expect(user.id).toEqual(createdUser.id);
    expect(user.name).toEqual("John Doe");
  });

  it("should throw an error if user is not found", async () => {
    await expect(() => sut.execute("non-existing-id")).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});