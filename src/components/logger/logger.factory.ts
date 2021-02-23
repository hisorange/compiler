import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { IFactory } from '../container/interfaces/factory.interface';
import { ILoggerConfig } from './interfaces/logger-config.interface';
import { ILogger } from './interfaces/logger.interface';

export class LoggerFactory implements IFactory<ILoggerConfig, ILogger> {
  public constructor(
    @Inject(Bindings.Provider.Logger) protected readonly logger: ILogger,
  ) {}

  create(config: ILoggerConfig): ILogger {
    const scope = [];

    if (config.label instanceof Array) {
      scope.push(...config.label);
    } else {
      scope.push(config.label);
    }

    return this.logger.scope(...scope);
  }
}
