import { Provider } from '@loopback/context';
import { Signale } from 'signale';
import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { IConfig } from '../container/interfaces/config.interface';

/**
 * Creates a root logger instance, every logger is a child logger of this.
 */
export class LoggerProvider implements Provider<Signale> {
  constructor(
    @Inject(Bindings.Config)
    protected readonly config: IConfig,
  ) {}

  value() {
    return new Signale({
      logLevel: this.config.debug ? 'info' : 'error',
    } as any);
  }
}
