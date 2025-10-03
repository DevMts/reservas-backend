export class HouseAlreadyRentedError extends Error {
  constructor() {
    super("House is already rented in this period");
    this.name = "HouseAlreadyRentedError";
  }
}