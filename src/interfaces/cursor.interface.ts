export interface ICursor {
  /**
   * Read the cursor's value.
   *
   * @type {number}
   * @memberof IIterable
   */
  readonly cursor: number;

  /**
   * Advance the cursor with the given steps.
   *
   * @param {number} steps
   * @returns {this}
   * @memberof IIterable
   */
  advance(steps: number): this;

  /**
   * Rewind the cursor to the given position.
   *
   * @param {number} position
   * @memberof ICursor
   */
  rewind(position: number);
}
