import type { Decimal } from "@prisma/client/runtime/library";

export interface House {
  id: string;
  price: number | Decimal;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  id_owner: string;
  id_address: string;
  rentals?: string[];
}

export interface HouseCreateInput {
  id?: string;
  price: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  id_owner: string;
  id_address: string;
  rentals?: string[];
}

export type FindByAddressData = {
  id?: string;
  city?: string;
  state?: string;
  cep?: string;
  neighborhood?: string;
  country?: string;
  road?: string;
};

export interface HouseRepository {
  create(data: HouseCreateInput): Promise<House>;
  findById(id: string): Promise<House | null>;
  findMany(): Promise<House[]>;
  findByAddressId(id: string): Promise<House | null>;
  findByAddress(data: FindByAddressData): Promise<House[] | null>;
  findByUser(id?: string, name?: string): Promise<House[] | null>;
  update(id: string, data: Partial<House>): Promise<House | null>;
  delete(id: string): Promise<boolean>;
}
