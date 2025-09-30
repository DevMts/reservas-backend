import type { UserRepository } from "../../repository/user-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(id: string) {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new ResourceNotFoundError();
    }
    await this.userRepository.delete(id);
  }
}
