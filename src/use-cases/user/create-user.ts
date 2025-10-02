import type { UserCreateInput, UserRepository } from "../../repository/user-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(data: UserCreateInput) {
    if (!data.name) {
      throw new Error("Name is required");
    }
    if (!data.email) {
      throw new Error("Email is required");
    }
    if (!data.cpf) {
      throw new Error("CPF is required");
    }
    const userWithSameEmail = await this.userRepository.findByEmail(data.email);
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const userWithSameCpf = await this.userRepository.findByCpf(data.cpf);
    if (userWithSameCpf) {
      throw new UserAlreadyExistsError();
    }
    const user = await this.userRepository.create(data);
    return { user };
  }
}
