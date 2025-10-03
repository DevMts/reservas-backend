import type { UserRepository } from "../../repository/user-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export class FindUserByIdUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ResourceNotFoundError();
    }
    return { user };
  }
}
