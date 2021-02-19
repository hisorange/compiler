type ReferenceShell<T> = () => T;

export class ReferenceResolver<T> {
  constructor(private readonly ref: ReferenceShell<T>) {}

  resolve(): T {
    return this.ref();
  }
}

export type iForwardRef<T> = (input: ReferenceShell<T>) => ReferenceResolver<T>;

export function forwardRef<T>(input: ReferenceShell<T>) {
  return new ReferenceResolver<T>(input);
}
