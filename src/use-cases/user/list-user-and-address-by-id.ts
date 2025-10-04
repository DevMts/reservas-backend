import type { UserRepository } from "@/repository/user-repository";

export class ListUserAndAddressByIdUseCase {
  constructor(private userRepository: UserRepository) { }
  async execute(id: string) {
    const userWithAddress = await this.userRepository.listUserAndAddressById(id);
    if (!userWithAddress?.user) {
      throw new Error("User not found");
    }
    return userWithAddress;
  }
}
