import type { Prisma } from "@prisma/client";
import type { UserRepository } from "../../repository/user-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(id: string, data: Prisma.UserUpdateInput) {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      throw new ResourceNotFoundError();
    }

    if (data.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(data.email as string);
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new UserAlreadyExistsError();
      }
    }

    if (data.cpf) {
      const userWithSameCpf = await this.userRepository.findByCpf(data.cpf as string);
      if (userWithSameCpf && userWithSameCpf.id !== id) {
        throw new UserAlreadyExistsError();
      }
    }

    const user = await this.userRepository.update(id, data);

    return { user };
  }
}
