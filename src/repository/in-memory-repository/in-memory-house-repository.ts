import type { House, HouseCreateInput, HouseRepository } from "../house-repository";

export class InMemoryHouseRepository implements HouseRepository {
  public items: House[] = [];

  async create(data: HouseCreateInput): Promise<House> {
    const house = {
      id: data.id ?? crypto.randomUUID(),
      price: data.price,
      description: data.description,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      id_owner: data.id_owner,
      id_address: data.id_address,
      rentals: data.rentals ?? [],
    }

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

  async update(id: string, data: Partial<House>): Promise<House | null> {
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
