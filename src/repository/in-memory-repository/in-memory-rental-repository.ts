import type { Rental, RentalCreateInput, RentalRepository } from "../rental-repository";

export class InMemoryRentalRepository implements RentalRepository {
  public items: Rental[] = [];

  create(data: RentalCreateInput): Promise<Rental> {
    const rental = {
      id: data.id ?? crypto.randomUUID(),
      check_in: data.check_in,
      check_out: data.check_out,
      createdAt: new Date(),
      updatedAt: new Date(),
      id_user: data.user,
      id_house: data.house,
    };

    this.items.push(rental);
    return Promise.resolve(rental);
  }
  async update(id: string, data: Partial<Rental>): Promise<Rental | null> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }
    const rental: Rental = {
      ...this.items[index],
      ...(data as Rental),
      updatedAt: new Date(),
    };
    this.items[index] = rental;
    return rental;
  }
  async findById(id: string): Promise<Rental | null> {
    const rental = this.items.find((item) => item.id === id);
    if (!rental) {
      return null;
    }
    return rental;
  }
  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    return true;
  }

  async findMany(): Promise<Rental[]> {
    return this.items;
  }



  async findByUserId(id_user: string): Promise<Rental[]> {
    return this.items.filter((item) => item.id_user === id_user);
  }
  async findByHouseId(id_house: string): Promise<Rental[]> {
    return this.items.filter((item) => item.id_house === id_house);
  }
  async findByDateRange(check_in: Date, check_out: Date): Promise<Rental[]> {
    return this.items.filter((item) => {
      const itemCheckIn = new Date(item.check_in);
      const itemCheckOut = new Date(item.check_out);
      return itemCheckIn <= check_out && itemCheckOut >= check_in;
    });
  }
  async findByUserIdAndDateRange(id_user: string, check_in: Date, check_out: Date): Promise<Rental[]> {
    return this.items.filter((item) => {
      const itemCheckIn = new Date(item.check_in);
      const itemCheckOut = new Date(item.check_out);
      return item.id_user === id_user && itemCheckIn <= check_out && itemCheckOut >= check_in;
    });
  }
  async findByHouseIdAndDateRange(id_house: string, check_in: Date, check_out: Date): Promise<Rental[]> {
    return this.items.filter((item) => {
      const itemCheckIn = new Date(item.check_in);
      const itemCheckOut = new Date(item.check_out);
      return item.id_house === id_house && itemCheckIn <= check_out && itemCheckOut >= check_in;
    });
  }
  async findByUserIdAndHouseIdAndDateRange(id_user: string, id_house: string, check_in: Date, check_out: Date): Promise<Rental[]> {
    return this.items.filter((item) => {
      const itemCheckIn = new Date(item.check_in);
      const itemCheckOut = new Date(item.check_out);
      return item.id_user === id_user && item.id_house === id_house && itemCheckIn <= check_out && itemCheckOut >= check_in;
    });
  }
}

