export class InvalidDateRangeError extends Error {
  constructor() {
    super("Invalid date range. Check-out date must be after check-in date.");
  }
}