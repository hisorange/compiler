import { Provider } from '@loopback/context';
import { Signale } from 'signale';

/**
 * Creates a root logger instance, every logger is a child logger of this.
 */
export class LoggerProvider implements Provider<Signale> {
  constructor() {}

  value() {
    return new Signale({
      logLevel: 'info',
    } as any);
  }
}
