export class InvalidCheckInDateError extends Error {
  constructor() {
    super("Check-in date cannot be in the past.");
    this.name = "InvalidCheckInDateError";
  }
}