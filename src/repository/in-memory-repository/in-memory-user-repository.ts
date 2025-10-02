// biome-ignore assist/source/organizeImports: true
import type { UserRepository, User, UserCreateInput } from "../user-repository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

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
      cpf: data.cpf,
      ddd: data.ddd,
      phone: data.phone,
      id_address: data.id_address ?? null,
    };

    this.users.push(newUser);
    return newUser;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user ?? null;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = this.users.find((user) => user.cpf === cpf);
    return user ?? null;
  }

  async findMany(): Promise<User[]> {
    return this.users;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      return null;
    }

    const updatedUser: User = {
      ...this.users[index],
      email: (data.email as string) ?? this.users[index].email,
      name: (data.name as string) ?? this.users[index].name,
      emailVerified: (data.emailVerified as boolean) ?? this.users[index].emailVerified,
      image: (data.image as string | null) ?? this.users[index].image,
      date_birth: (data.date_birth as Date) ?? this.users[index].date_birth,
      cpf: (data.cpf as string) ?? this.users[index].cpf,
      ddd: (data.ddd as string) ?? this.users[index].ddd,
      phone: (data.phone as string) ?? this.users[index].phone,
      id_address: data.id_address ?? this.users[index].id_address,
      updatedAt: new Date(),
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);
    return true;
  }

  // Métodos úteis para testes
  async clear(): Promise<void> {
    this.users = [];
  }

  async count(): Promise<number> {
    return this.users.length;
  }
}