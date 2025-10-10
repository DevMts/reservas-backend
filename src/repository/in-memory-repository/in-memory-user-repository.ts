import type {
  User,
  UserCreateInput,
  UserRepository,
  UserWithAddress,
} from "../user-repository";
import type { InMemoryAddressRepository } from "./in-memory-address-repository";

export class InMemoryUserRepository implements UserRepository {
  public itens: User[] = [];

  constructor(private addressRepo: InMemoryAddressRepository) { }

  async create(data: UserCreateInput): Promise<User> {
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.email,
      name: data.name,
      emailVerified: data.emailVerified ?? false,
      image: data.image ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Campos customizados
      date_birth: data.date_birth as Date,
      cpf: data.cpf ?? null,
      ddd: data.ddd ?? null,
      phone: data.phone ?? null,
      id_address: data.id_address ?? null,
    };

    this.itens.push(newUser);
    return newUser;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.itens.find((user) => user.id === id);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.itens.find((user) => user.email === email);
    return user ?? null;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.itens.find((user) => user.cpf === cpf);
    return user ?? null;
  }

  async findMany(): Promise<User[]> {
    return this.itens;
  }

  async listUserAndAddressById(id: string): Promise<UserWithAddress | null> {
    const user = this.itens.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    const address = await this.addressRepo.findById(user.id_address as string);

    return {
      user,
      address,
    };
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const index = this.itens.findIndex((user) => user.id === id);

    if (index === -1) {
      return null;
    }

    const updatedUser: User = {
      ...this.itens[index],
      email: (data.email as string) ?? this.itens[index].email,
      name: (data.name as string) ?? this.itens[index].name,
      emailVerified:
        (data.emailVerified as boolean) ?? this.itens[index].emailVerified,
      image: (data.image as string | null) ?? this.itens[index].image,
      date_birth: (data.date_birth as Date) ?? this.itens[index].date_birth,
      cpf: (data.cpf as string) ?? this.itens[index].cpf,
      ddd: (data.ddd as string) ?? this.itens[index].ddd,
      phone: (data.phone as string) ?? this.itens[index].phone,
      id_address: data.id_address ?? this.itens[index].id_address,
      updatedAt: new Date(),
    };

    this.itens[index] = updatedUser;
    return updatedUser;
  }

  async addAddress(id: string, addressId: string): Promise<User | null> {
    const userIndex = this.itens.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    const user = this.itens[userIndex];
    user.id_address = addressId;
    user.updatedAt = new Date();
    this.itens[userIndex] = user;
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.itens.findIndex((user) => user.id === id);

    if (index === -1) {
      return false;
    }

    this.itens.splice(index, 1);
    return true;
  }

  // Métodos úteis para testes
  async clear(): Promise<void> {
    this.itens = [];
  }

  async count(): Promise<number> {
    return this.itens.length;
  }
}
