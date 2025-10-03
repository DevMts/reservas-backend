import type { Prisma, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UserRepository } from "../user-repository";

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
        id
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

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = await prisma.user.update({
      where: { id },
      data,
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
