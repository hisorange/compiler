import { ICursor } from './cursor.interface';

export interface IIterable<T> extends ICursor {
  /**
   * Check if the cursor points to an existing element.
   *
   * @type {boolean}
   * @memberof IIterable
   */
  readonly isValid: boolean;

  /**
   * Read the previous element in the collection,
   * will result in undefined if the cursor is out of range.
   *
   * @type {(T | undefined)}
   * @memberof IIterable
   */
  readonly prev: T | undefined;

  /**
   * Read the current item, will result
   * in undefined if the cursor is out of range.
   *
   * @returns {(T | undefined)}
   * @memberof IIterable
   */
  readonly current: T | undefined;

  /**
   * Read the next element in the collection,
   * will result in undefined if the cursor is out of range.
   *
   * @type {(T | undefined)}
   * @memberof IIterable
   */
  readonly next: T | undefined;
}
