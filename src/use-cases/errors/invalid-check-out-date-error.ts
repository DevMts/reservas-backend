export class InvalidCheckOutDateError extends Error {
  constructor() {
    super("Check-out date must be after check-in date");
    this.name = "InvalidCheckOutDateError";
  }
}