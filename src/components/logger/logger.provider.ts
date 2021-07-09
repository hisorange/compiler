import { Provider } from '@loopback/context';
import { Signale, SignaleOptions } from 'signale';
import { KernelEnvironment } from '../../kernel/enumerators/kernel-environment.enum';
import { IKernelConfig } from '../../kernel/interfaces/kernel-config.interface';
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
      logLevel:
        this.config.environment === KernelEnvironment.PRODUCTION
          ? 'info'
          : 'debug',
      disabled: this.config.environment === KernelEnvironment.TESTING,
    };

    return new Signale(options);
  }
}
