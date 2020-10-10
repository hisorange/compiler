export interface IEventEmitter {
  /**
   * Publish an event.
   *
   * @param {string} event
   * @param {T} data
   * @memberof IEventEmitter
   */
  publish<T>(event: string, data?: T): void;

  /**
   * Subscribe to the event.
   *
   * @param {string} event
   * @param {(data?: T) => void} subscriber
   * @memberof IEventEmitter
   */
  subscribe<T>(event: string, subscriber: (data?: T) => void): void;
}
