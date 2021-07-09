import { Provider } from '@loopback/context';
import { Signale, SignaleOptions } from 'signale';
import { IKernelConfig } from '../../kernel/kernel-config.interface';
import { KernelMode } from '../../kernel/kernel-mode.enum';
import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators';

/**
 * Creates a root logger instance, every logger is a child logger of this.
 */
export class LoggerProvider implements Provider<Signale> {
  constructor(
    @Inject(Bindings.Config)
    protected readonly config: IKernelConfig,
  ) {}

  value() {
    const options: SignaleOptions = {
      logLevel: this.config.mode === KernelMode.PRODUCTION ? 'info' : 'debug',
      disabled: this.config.mode === KernelMode.TESTING,
    };

    return new Signale(options);
  }
}
