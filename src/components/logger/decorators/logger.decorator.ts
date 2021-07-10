import { Context, inject, Injection } from '@loopback/context';
import { Bindings } from '../../container';

export function Logger(label: string) {
  return inject(
    Bindings.Factory.Logger,
    {
      decorator: '@Logger',
    },
    (ctx: Context, injection: Readonly<Injection>, session) => {
      return ctx.getSync(Bindings.Factory.Logger).create({
        label,
      });
    },
  );
}
