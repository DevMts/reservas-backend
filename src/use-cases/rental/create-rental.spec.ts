import { beforeEach, describe, expect, it } from "vitest";
import type { House } from "@/repository/house-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { InMemoryRentalRepository } from "@/repository/in-memory-repository/in-memory-rental-repository";
import { InMemoryUserRepository } from "@/repository/in-memory-repository/in-memory-user-repository";
import type { User } from "@/repository/user-repository";
import { HouseAlreadyRentedError } from "../errors/house-already-rented-error";
import { HouseNotFoundError } from "../errors/house-not-found-error";
import { InvalidCheckOutDateError } from "../errors/invalid-check-out-date-error";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { CreateRentalUseCase } from "./create-rental";

describe("Create Rental Use Case", () => {
  let rentalRepository: InMemoryRentalRepository;
  let houseRepository: InMemoryHouseRepository;
  let userRepository: InMemoryUserRepository;
  let sut: CreateRentalUseCase;
  let user: User;
  let house: House;

  beforeEach(async () => {
    rentalRepository = new InMemoryRentalRepository();
    houseRepository = new InMemoryHouseRepository();
    userRepository = new InMemoryUserRepository();
    sut = new CreateRentalUseCase(
      rentalRepository,
      houseRepository,
      userRepository,
    );

    // Criar um usuário e uma casa para os testes
    user = await userRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      cpf: "12345678900",
      date_birth: new Date("1990-01-01"),
      ddd: "11",
      phone: "999999999",
    });

    house = await houseRepository.create({
      description: "A nice house",
      price: 100,
      id_address: "address-1",
      id_owner: "owner-1",
    });
  });

  it("should be able to create a new rental", async () => {
    const rentalData = {
      user: user.id,
      house: house.id,
      check_in: new Date("2024-01-10"),
      check_out: new Date("2024-01-15"),
    };

    const rental = await sut.execute(rentalData);

    expect(rental.id).toEqual(expect.any(String));
    expect(rental.id_user).toBe(user.id);
    expect(rental.id_house).toBe(house.id);
    expect(rentalRepository.items).toHaveLength(1);
    expect(rentalRepository.items[0]).toEqual(rental);
  });

  it("should not be able to create a rental if user does not exist", async () => {
    const rentalData = {
      user: "non-existing-user-id",
      house: house.id,
      check_in: new Date("2024-01-10"),
      check_out: new Date("2024-01-15"),
    };

    await expect(sut.execute(rentalData)).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("should not be able to create a rental if house does not exist", async () => {
    const rentalData = {
      user: user.id,
      house: "non-existing-house-id",
      check_in: new Date("2024-01-10"),
      check_out: new Date("2024-01-15"),
    };

    await expect(sut.execute(rentalData)).rejects.toBeInstanceOf(HouseNotFoundError);
  });

  it("should not be able to create a rental with check-out date before check-in date", async () => {
    const rentalData = {
      user: user.id,
      house: house.id,
      check_in: new Date("2024-01-15"),
      check_out: new Date("2024-01-10"),
    };

    await expect(sut.execute(rentalData)).rejects.toBeInstanceOf(
      InvalidCheckOutDateError,
    );
  });

  it("should not be able to create a rental if the house is already rented in the same period", async () => {
    // Aluguel existente
    await rentalRepository.create({
      user: user.id,
      house: house.id,
      check_in: new Date("2024-02-10"),
      check_out: new Date("2024-02-20"),
    });

    // Tentativa de novo aluguel com sobreposição (início durante o aluguel existente)
    const overlappingRentalData1 = {
      user: user.id,
      house: house.id,
      check_in: new Date("2024-02-15"),
      check_out: new Date("2024-02-25"),
    };

    await expect(sut.execute(overlappingRentalData1)).rejects.toBeInstanceOf(
      HouseAlreadyRentedError,
    );

    // Tentativa de novo aluguel com sobreposição (fim durante o aluguel existente)
    const overlappingRentalData2 = {
      user: user.id,
      house: house.id,
      check_in: new Date("2024-02-05"),
      check_out: new Date("2024-02-15"),
    };

    await expect(sut.execute(overlappingRentalData2)).rejects.toBeInstanceOf(
      HouseAlreadyRentedError,
    );

    // Tentativa de novo aluguel que engloba o aluguel existente
    const overlappingRentalData3 = {
      user: user.id,
      house: house.id,
      check_in: new Date("2024-02-05"),
      check_out: new Date("2024-02-25"),
    };

    await expect(sut.execute(overlappingRentalData3)).rejects.toBeInstanceOf(
      HouseAlreadyRentedError,
    );

    // Tentativa de novo aluguel contido dentro do aluguel existente
    const overlappingRentalData4 = {
      user: user.id,
      house: house.id,
      check_in: new Date("2024-02-12"),
      check_out: new Date("2024-02-18"),
    };

    await expect(sut.execute(overlappingRentalData4)).rejects.toBeInstanceOf(
      HouseAlreadyRentedError,
    );
  });
});
