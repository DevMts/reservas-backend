export interface AddressRepository {
  create(data: AddressCreateInput): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  delete(id: string): Promise<boolean>;
  update(id: string, data: Partial<Address>): Promise<Address>;
}

export interface Address {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cep: string;
  road: string;
  neighborhood: string;
  house_number: string;
  city: string;
  state: string;
  country: string;
}

export interface AddressCreateInput {
  id?: string;
  cep: string;
  road: string;
  neighborhood: string;
  house_number: string;
  city: string;
  state: string;
  country: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  id_user?: string;
  id_houses?: string;
}