import type { UserRepository } from "@/repository/user-repository";

export class ListAllUserUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute() {
    const users = await this.userRepository.findMany();

    return {
      users,
    };
  }
}
