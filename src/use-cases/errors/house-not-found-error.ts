export class HouseNotFoundError extends Error {
  constructor() {
    super("House does not exist");
    this.name = "HouseNotFoundError";
  }
}