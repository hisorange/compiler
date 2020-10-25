export abstract class BaseException<C> extends Error {
  constructor(public readonly message: string, public readonly context: C = undefined) {
    super(message);
  }
}
