export class SaveFailedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SaveFailedException';
  }
}
