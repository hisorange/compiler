import { BindingAddress, Context } from '@loopback/context';
import { ILogger } from '../logger';
import { Bindings } from './bindings';
import { KernelException } from './exceptions';
import { MissingBindingExceptionContext } from './interfaces';

export class Container extends Context {
  protected logger: ILogger;

  protected getLogger() {
    if (!this.logger) {
      this.logger = super.getSync(Bindings.Factory.Logger).create({
        label: 'Container',
      });
    }

    return this.logger;
  }

  getSync<T>(key: BindingAddress<T>): T {
    if (super.contains(key)) {
      this.getLogger().debug('Resolving binding', {
        key: key.toString(),
      });

      return super.getSync(key);
    }

    throw new KernelException<MissingBindingExceptionContext>(
      `Missing kernel binding`,
      {
        binding: key.toString(),
      },
    );
  }
}
