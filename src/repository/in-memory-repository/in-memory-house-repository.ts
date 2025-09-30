import type { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import type { House, HouseRepository } from "../house-repository";

export class InMemoryHouseRepository implements HouseRepository {
  public items: House[] = [];

  async create(data: Prisma.HouseCreateInput): Promise<House> {
    const house: House = {
      id: crypto.randomUUID() as string,
      price: new Decimal(data.price as number),
      description: data.description,
      id_owner: (data.owner as { connect: { id: string } }).connect.id,
      id_address: (data.address as { connect: { id: string } }).connect.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(house);

    return house;
  }

  async findById(id: string): Promise<House | null> {
    const house = this.items.find((item) => item.id === id);

    if (!house) {
      return null;
    }

    return house;
  }

  async findMany(): Promise<House[]> {
    return this.items;
  }

  async update(id: string, data: House): Promise<House | null> {
    const houseIndex = this.items.findIndex((item) => item.id === id);

    if (houseIndex === -1) {
      return null;
    }

    const house = {
      ...this.items[houseIndex],
      ...data,
      updatedAt: new Date(),
    };

    this.items[houseIndex] = house;

    return house;
  }

  async delete(id: string): Promise<boolean> {
    const houseIndex = this.items.findIndex((item) => item.id === id);

    if (houseIndex === -1) {
      return false;
    }

    this.items.splice(houseIndex, 1);

    return true;
  }
}
