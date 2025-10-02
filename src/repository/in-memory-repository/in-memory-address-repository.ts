import type {
  Address,
  AddressCreateInput,
  AddressRepository,
} from "../address-repository";

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = [];

  async create(data: AddressCreateInput): Promise<Address> {
    const address: Address = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(address);

    return address;
  }

  async findById(id: string): Promise<Address | null> {
    const address = this.items.find((item) => item.id === id);
    if (!address) {
      return null;
    }
    return address;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    return true;
  }

  async update(id: string, data: Partial<Address>): Promise<Address> {
    const index = this.items.findIndex((item) => item.id === id);


    if (index === -1) {
      throw new Error("Address not found");
    }

    const address: Address = {
      ...this.items[index],
      ...(data as Address),
      updatedAt: new Date(),
    };
    this.items[index] = address;
    return address;
  }
}
