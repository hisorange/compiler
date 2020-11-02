import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { LoggerFactory } from '../logger';
import { ILogger } from '../logger/interfaces/logger.interface';
import { IEventEmitter } from './interfaces/event-emitter.interface';
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
