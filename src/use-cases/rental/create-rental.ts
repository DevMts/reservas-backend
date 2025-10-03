
import type { HouseRepository } from "@/repository/house-repository";
import type {
  Rental,
  RentalCreateInput,
  RentalRepository,
} from "@/repository/rental-repository";
import type { UserRepository } from "@/repository/user-repository";
import { HouseAlreadyRentedError } from "../errors/house-already-rented-error";
import { HouseNotFoundError } from "../errors/house-not-found-error";
import { InvalidCheckOutDateError } from "../errors/invalid-check-out-date-error";
import { UserNotFoundError } from "../errors/user-not-found-error";

export class CreateRentalUseCase {
  constructor(
    private rentalRepository: RentalRepository,
    private houseRepository: HouseRepository,
    private userRepo: UserRepository,
  ) { }

  async execute(data: RentalCreateInput): Promise<Rental> {
    const userExists = await this.userRepo.findById(data.user);
    if (!userExists) {
      throw new UserNotFoundError();
    }

    const houseExists = await this.houseRepository.findById(data.house);
    if (!houseExists) {
      throw new HouseNotFoundError();
    }

    if (data.check_in >= data.check_out) {
      throw new InvalidCheckOutDateError();
    }

    const rentalsInSamePeriod =
      await this.rentalRepository.findByHouseId(data.house);

    const isHouseAlreadyRented = rentalsInSamePeriod.some((rental) => {
      const checkIn = data.check_in;
      const checkOut = data.check_out;

      return (
        (checkIn >= rental.check_in && checkIn < rental.check_out) ||
        (checkOut > rental.check_in && checkOut <= rental.check_out) ||
        (checkIn <= rental.check_in && checkOut >= rental.check_out)
      );
    });

    if (isHouseAlreadyRented) {
      throw new HouseAlreadyRentedError();
    }

    const rental = await this.rentalRepository.create(data);
    return rental;
  }
}
