import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { LoggerFactory } from '../factories/logger.factory';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import CrispHooks = require('crisphooks');

export class EventEmitter implements IEventEmitter {
  protected readonly engine = new CrispHooks();
  protected readonly logger: ILogger;

  constructor(@Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: ['Compiler', this.constructor.name],
    });
  }

  publish<T>(event: string, data: T = null) {
    this.logger.debug('Emitting', { event });
    this.engine.triggerSync(event, data);
  }

  subscribe<T>(event: string, callback: (data?: T) => void) {
    this.engine.hookSync(event, callback);
  }
}
