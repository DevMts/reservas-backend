import type { User, UserRepository } from "@/repository/user-repository";

export class CompleteUserProfileUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(data: {
    userId: string;
    date_birth: Date;
    cpf: string;
    ddd: string;
    phone: string;
    id_address?: string | null;
  }): Promise<User> {
    const { userId, date_birth, cpf, ddd, phone, id_address } = data;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.completed_profile) {
      throw new Error("User profile is already complete");
    }

    const existingCpfUser = await this.userRepository.findByCpf(cpf);
    if (existingCpfUser && existingCpfUser.id !== userId) {
      throw new Error("CPF already in use");
    }

    const updatedUser = await this.userRepository.update(userId, {
      date_birth,
      cpf,
      ddd,
      phone,
      id_address: id_address ?? null,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user profile");
    }

    const completedUser = await this.userRepository.completeProfile(userId);

    if (!completedUser) {
      throw new Error("Failed to complete user profile");
    }

    return updatedUser;
  }
}
