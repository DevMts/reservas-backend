export interface House {
  id: string;
  price: number;
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

export interface HouseRepository {
  create(data: HouseCreateInput): Promise<House>;
  findById(id: string): Promise<House | null>;
  findMany(): Promise<House[]>;
  update(id: string, data: Partial<House>): Promise<House | null>;
  delete(id: string): Promise<boolean>;
}
