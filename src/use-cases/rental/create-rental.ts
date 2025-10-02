
import type { HouseRepository } from "@/repository/house-repository";
import type {
  Rental,
  RentalCreateInput,
  RentalRepository,
} from "@/repository/rental-repository";
import type { UserRepository } from "@/repository/user-repository";

export class CreateRentalUseCase {
  constructor(
    private rentalRepository: RentalRepository,
    private houseRepository: HouseRepository,
    private userRepo: UserRepository,
  ) { }

  async execute(data: RentalCreateInput): Promise<Rental> {
    const userExists = await this.userRepo.findById(data.user);
    if (!userExists) {
      throw new Error("User does not exist");
    }

    const houseExists = await this.houseRepository.findById(data.house);
    if (!houseExists) {
      throw new Error("House does not exist");
    }

    if (data.check_in >= data.check_out) {
      throw new Error("Check-out date must be after check-in date");
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
      throw new Error("House is already rented in this period");
    }

    const rental = await this.rentalRepository.create(data);
    return rental;
  }
}
