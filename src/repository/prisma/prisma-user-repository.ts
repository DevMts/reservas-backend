import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { User, UserRepository, UserWithAddress } from "../user-repository";

export class PrismaUserRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = await prisma.user.create({
      data,
    });
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { cpf },
    });
    return user;
  }

  async findMany(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users;
  }

  async listUserAndAddressById(id: string): Promise<UserWithAddress | null> {
    const userWithAddress = await prisma.user.findUnique({
      where: { id },
      include: {
        address: true,
      },
    });
    if (!userWithAddress) {
      return null;
    }
    if (!userWithAddress.address) {
      return null;
    }
    return {
      user: {
        id: userWithAddress?.id,
        name: userWithAddress?.name,
        email: userWithAddress?.email,
        emailVerified: userWithAddress?.emailVerified,
        image: userWithAddress?.image,
        createdAt: userWithAddress?.createdAt,
        updatedAt: userWithAddress?.updatedAt,
        date_birth: userWithAddress?.date_birth,
        cpf: userWithAddress?.cpf,
        ddd: userWithAddress?.ddd,
        phone: userWithAddress?.phone,
        id_address: userWithAddress?.id_address,
      },
      address: userWithAddress?.address,
    };
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return user;
  }

  async addAddress(id: string, addressId: string): Promise<User | null> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        id_address: addressId,
      },
    });
    return user;
  }
  async delete(id: string): Promise<boolean> {
    await prisma.user.delete({
      where: { id },
    });
    return true;
  }
}
