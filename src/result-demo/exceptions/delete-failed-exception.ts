export class DeleteFailedException extends Error {
  readonly type = DeleteFailedException.name;
  constructor(message: string) {
    super(message);
    this.name = 'DeleteFailedException';
  }
}
