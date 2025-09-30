export class UserAlreadyExistsError extends Error {
  constructor() {
    super("E-mail or CPF already exists.");
  }
}
