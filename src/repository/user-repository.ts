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
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Campos opcionais (como no Prisma schema)
  date_birth: Date | null;
  cpf: string | null;
  ddd: string | null;
  phone: string | null;
  id_address: string | null;
}

export interface UserCreateInput {
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  // Opcionais no create também
  date_birth?: Date | string;
  cpf?: string;
  ddd?: string;
  phone?: string;
  id_address?: string | null;
}