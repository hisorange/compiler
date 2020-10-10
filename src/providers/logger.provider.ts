import { Provider } from '@loopback/context';
import { Signale } from 'signale';
import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { IConfig } from '../interfaces/config.interface';

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
