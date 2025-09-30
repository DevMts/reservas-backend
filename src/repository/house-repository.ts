import type { House, Prisma } from "@prisma/client";

export type { House };

export interface HouseRepository {
  create(data: Prisma.HouseCreateInput): Promise<House>;
  findById(id: string): Promise<House | null>;
  findMany(): Promise<House[]>;
  update(id: string, data: House): Promise<House | null>;
  delete(id: string): Promise<boolean>;
}
