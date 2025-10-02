
export interface UserRepository {
  create(data: UserCreateInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findMany(): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

export interface User {
  name: string;
  id: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  date_birth: Date;
  cpf: string;
  ddd: string;
  phone: string;
  id_address: string | null;
}

export interface UserCreateInput {
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  date_birth: Date | string;
  cpf: string;
  ddd: string;
  phone: string;
  id_address?: string | null;

}