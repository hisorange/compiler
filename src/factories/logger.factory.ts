import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { ILogger } from '../interfaces/components/logger.interface';
import { IFactory } from '../interfaces/factory.interface';
import { ILoggerConfig } from '../interfaces/logger-config.interface';

export class LoggerFactory implements IFactory<ILoggerConfig, ILogger> {
  public constructor(@Inject(Bindings.Provider.Logger) protected readonly logger: ILogger) {}

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
