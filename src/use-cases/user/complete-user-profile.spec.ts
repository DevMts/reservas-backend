import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import type { User } from "@/repository/user-repository";
import { CompleteUserProfileUseCase } from "./complete-user-profile";

describe("Complete User Profile Use Case", () => {
  let userRepository: InMemoryUserRepository;
  let sut: CompleteUserProfileUseCase;
  let user: User;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    sut = new CompleteUserProfileUseCase(userRepository);

    // Create a base user for tests
    user = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
    });
  });

  it("should be able to complete a user profile", async () => {
    const profileData = {
      userId: user.id,
      date_birth: new Date("1990-01-15"),
      cpf: "11122233344",
      ddd: "11",
      phone: "987654321",
      id_address: "address-01",
    };

    const { cpf, date_birth, ddd, phone, id_address } =
      await sut.execute(profileData);

    expect(cpf).toBe("11122233344");
    expect(date_birth).toEqual(new Date("1990-01-15"));
    expect(ddd).toBe("11");
    expect(phone).toBe("987654321");
    expect(id_address).toBe("address-01");

    const userInDb = await userRepository.findById(user.id);
    expect(userInDb?.cpf).toBe("11122233344");
  });

  it("should throw an error if user is not found", async () => {
    const profileData = {
      userId: "non-existing-user-id",
      date_birth: new Date("1990-01-15"),
      cpf: "11122233344",
      ddd: "11",
      phone: "987654321",
    };

    await expect(sut.execute(profileData)).rejects.toThrow("User not found");
  });

  it("should throw an error if CPF is already in use by another user", async () => {
    // Create another user with a specific CPF
    await userRepository.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      cpf: "55566677788",
    });

    const profileData = {
      userId: user.id,
      date_birth: new Date("1990-01-15"),
      cpf: "55566677788", // CPF already used by Jane Doe
      ddd: "11",
      phone: "987654321",
    };

    await expect(sut.execute(profileData)).rejects.toThrow(
      "CPF already in use",
    );
  });

  it("should allow completing profile with user's own CPF", async () => {
    // First, set a CPF for the user
    await userRepository.update(user.id, { cpf: "11122233344" });

    const profileData = {
      userId: user.id,
      date_birth: new Date("1995-05-20"),
      cpf: "11122233344", // Using the same CPF
      ddd: "22",
      phone: "123456789",
    };

    const updatedUser = await sut.execute(profileData);
    expect(updatedUser.cpf).toBe("11122233344");
    expect(updatedUser.ddd).toBe("22");
  });

  it("should throw an error if the profile update fails", async () => {
    // Mock the update method to simulate a failure
    vi.spyOn(userRepository, "update").mockResolvedValueOnce(null);

    await expect(
      sut.execute({ userId: user.id, cpf: "123" } as any),
    ).rejects.toThrow("Failed to update user profile");
  });
});
