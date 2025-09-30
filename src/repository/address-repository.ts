import type { Address, Prisma } from "@prisma/client";

export type { Address };

export interface AddressRepository {
  create(data: Prisma.AddressCreateInput): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  delete(id: string): Promise<boolean>;
}
