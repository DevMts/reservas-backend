import { beforeEach, describe, expect, it, vi } from "vitest";
import type { House } from "@/repository/house-repository";
import { InMemoryHouseRepository } from "@/repository/in-memory-repository/in-memory-house-repository";
import { UpdateHouseUseCase } from "./update-house";

describe("Update House Use Case", () => {
  let houseRepository: InMemoryHouseRepository;
  let sut: UpdateHouseUseCase;
  let createdHouse: House;

  beforeEach(async () => {
    houseRepository = new InMemoryHouseRepository();
    sut = new UpdateHouseUseCase(houseRepository);

    createdHouse = await houseRepository.create({
      price: 150.5,
      description: "A beautiful house near the beach",
      id_owner: "owner-01",
      id_address: "address-01",
    });
  });

  it("should be able to update a house", async () => {
    const updateData = {
      price: 200.0,
      description: "An even more beautiful house near the beach",
    };

    const updatedHouse = await sut.execute(createdHouse.id, updateData);

    expect(updatedHouse).not.toBeNull();
    expect(updatedHouse?.id).toBe(createdHouse.id);
    expect(updatedHouse?.price).toBe(200.0);
    expect(updatedHouse?.description).toBe(
      "An even more beautiful house near the beach",
    );
    expect(updatedHouse?.createdAt).toEqual(createdHouse.createdAt);
    expect(updatedHouse?.updatedAt).toBeInstanceOf(Date);
    expect(updatedHouse?.updatedAt.getTime()).toBeGreaterThanOrEqual(
      createdHouse.updatedAt.getTime(),
    );
  });

  it("should throw an error if the house does not exist", async () => {
    await expect(
      sut.execute("non-existing-id", { price: 300 }),
    ).rejects.toThrow("House not found");
  });

  it("should return null if the repository fails to update", async () => {
    // Simula um cenário onde o repositório retorna null
    vi.spyOn(houseRepository, "update").mockResolvedValueOnce(null);

    const result = await sut.execute(createdHouse.id, { price: 400 });

    expect(result).toBeNull();
  });
});
