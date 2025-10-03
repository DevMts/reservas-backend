export class RentalNotFoundError extends Error {
  constructor() {
    super("Rental not found");
    this.name = "RentalNotFoundError";
  }
}