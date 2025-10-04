import type { AddressRepository } from "@/repository/address-repository";
import type { UserRepository } from "@/repository/user-repository";

export class AddAddressForUserProfileCase {
  constructor(
    private userRepository: UserRepository,
    private addressRepository: AddressRepository,
  ) { }

  async execute(userId: string, addressId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new Error("Address not found");
    }

    const updatedUser = await this.userRepository.addAddress(userId, addressId);

    if (!updatedUser) {
      throw new Error("Failed to add address to user profile");
    }

    return updatedUser;
  }
}
