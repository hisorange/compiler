import { Logger } from '../logger';
import { ILogger } from '../logger/interfaces/logger.interface';
import { IEventEmitter } from './interfaces/event-emitter.interface';
import CrispHooks = require('crisphooks');

export class EventEmitter implements IEventEmitter {
  protected readonly engine = new CrispHooks();

  constructor(@Logger('EventEmitter') protected logger: ILogger) {}

  publish<T>(event: string, data: T = null) {
    this.logger.debug('Emitting', { event });
    this.engine.triggerSync(event, data);
  }

  subscribe<T>(event: string, callback: (data?: T) => void) {
    this.engine.hookSync(event, callback);
  }
}
