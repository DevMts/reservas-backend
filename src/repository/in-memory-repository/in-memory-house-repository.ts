import type {
  FindByAddressData,
  House,
  HouseCreateInput,
  HouseRepository,
} from "../house-repository";
import type { InMemoryAddressRepository } from "./in-memory-address-repository";
import type { InMemoryRentalRepository } from "./in-memory-rental-repository";
import type { InMemoryUserRepository } from "./in-memory-user-repository";

export class InMemoryHouseRepository implements HouseRepository {
  public items: House[] = [];

  constructor(
    private addressRepo: InMemoryAddressRepository,
    private userRepo: InMemoryUserRepository,
    private rentalRepo?: InMemoryRentalRepository,
  ) { }

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
  async findByAddressId(id: string): Promise<House | null> {
    const address = this.items.find((item) => item.id_address === id);
    if (!address) {
      return null;
    }
    return address;
  }

  async findByAddress(data: FindByAddressData): Promise<House[] | null> {
    const addresses = this.addressRepo.items.filter(
      (addr) =>
        (data.cep ? addr.cep === data.cep : true) &&
        (data.city ? addr.city === data.city : true) &&
        (data.country ? addr.country === data.country : true) &&
        (data.neighborhood ? addr.neighborhood === data.neighborhood : true) &&
        (data.road ? addr.road === data.road : true) &&
        (data.state ? addr.state === data.state : true),
    );

    if (addresses.length === 0) return null;

    const houses: House[] = [];

    for (const addr of addresses) {
      const addressHouses = this.items.filter((h) => h.id_address === addr.id);
      houses.push(...addressHouses);
    }

    return houses;
  }

  async findByUser(id: string, name: string): Promise<House[] | null> {
    const users = this.userRepo.itens.filter(
      (item) => item.id === id || item.name === name,
    );

    if (users.length === 0) return null;

    const houses: House[] = [];

    for (const user of users) {
      const userHouses = this.items.filter((item) => item.id_owner === user.id);
      houses.push(...userHouses);
    }

    return houses.map((h) => ({
      ...h,
    }));
  }

  async findByDatesFree(
    check_in: Date,
    check_out: Date,
  ): Promise<House[]> {
    const houses = this.items.filter((house) => {
      const houseRentals = this.rentalRepo?.items.filter(
        (rental) => rental.id_house === house.id,
      ) ?? [];

      if (houseRentals.length === 0) return true;

      const hasConflict = houseRentals.some((rental) => {
        const overlaps =
          !(check_out <= rental.check_in || check_in >= rental.check_out);
        return overlaps;
      });


      return !hasConflict;
    });

    return houses;
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
