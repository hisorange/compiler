import { IConsumable } from './consumable.interface';
import { IIterable } from './iterable.interface';

export interface ICollection<T> extends IIterable<T>, IConsumable<T> {
  /**
   * Add an item to the end of the collection.
   *
   * @param {T} item
   * @returns {this}
   * @memberof ICollection
   */
  push(item: T): this;

  /**
   * Check if the collection is empty.
   *
   * @type {boolean}
   * @memberof ICollection
   */
  empty: boolean;

  /**
   * Number of items in the collection.
   *
   * @type {number}
   * @memberof ICollection
   */
  length: number;

  /**
   * Raw items.
   *
   * @type T[]
   * @memberof ICollection
   */
  items: T[];

  /**
   * Slice a chunk from the collection.
   *
   * @param {number} start
   * @param {number} [length]
   * @returns {T[]}
   * @memberof ICollection
   */
  slice(start: number, length?: number): T[];

  /**
   * Creates a clone from the current state.
   *
   * @returns {ICollection<T>}
   * @memberof ICollection
   */
  clone(): ICollection<T>;
}
