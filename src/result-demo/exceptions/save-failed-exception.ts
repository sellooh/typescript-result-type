export class SaveFailedException extends Error {
  readonly name: 'SaveFailedException';

  constructor(message: string) {
    super(message);
  }
}
