import type { Prisma, User } from "@prisma/client";

export type { User };

export interface UserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findMany(): Promise<User[]>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
