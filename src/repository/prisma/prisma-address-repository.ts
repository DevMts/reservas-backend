import { prisma } from "@/lib/prisma";
import type { Address, AddressCreateInput, AddressRepository } from "@/repository/address-repository";

export class PrismaAddressRepository implements AddressRepository {
  async create(data: AddressCreateInput): Promise<Address> {
    const address = await prisma.address.create({
      data,
    });
    return address;
  }
  async findById(id: string): Promise<Address | null> {
    const address = await prisma.address.findUnique({
      where: { id },
    });
    return address;
  }
  async delete(id: string): Promise<boolean> {
    await prisma.address.delete({
      where: { id },
    });

    return true;
  }
  update(id: string, data: Partial<Address>): Promise<Address> {
    const address = prisma.address.update({
      where: { id },
      data,
    });
    return address;
  }
}
