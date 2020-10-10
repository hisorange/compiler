export interface IConsumable<T> {
  /**
   * Consume the given amount.
   *
   * @param {number} [amount]
   * @returns {T[]}
   * @memberof IConsumable
   */
  consume(amount?: number): T[];
}
