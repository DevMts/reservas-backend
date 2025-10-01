import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { ListAllHousesUseCase } from "./list-all-houses";

describe("List All Houses Use Case", () => {
  let houseRepository: InMemoryHouseRepository;
  let sut: ListAllHousesUseCase;

  beforeEach(() => {
    houseRepository = new InMemoryHouseRepository();
    sut = new ListAllHousesUseCase(houseRepository);
  });

  it("should be able to list all registered houses", async () => {
    const house1 = await houseRepository.create({
      price: 100,
      description: "A small and cozy house.",
      id_owner: "owner-01",
      id_address: "address-01",
    });

    const house2 = await houseRepository.create({
      price: 500,
      description: "A big house with a pool.",
      id_owner: "owner-02",
      id_address: "address-02",
    });

    const houses = await sut.execute();

    expect(houses).toHaveLength(2);
    expect(houses).toEqual([house1, house2]);
  });

  it("should return an empty array when there are no houses", async () => {
    const houses = await sut.execute();

    expect(houses).toHaveLength(0);
    expect(houses).toEqual([]);
  });
});
