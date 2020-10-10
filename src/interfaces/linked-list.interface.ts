/**
 * Basic implementation of a linked list object.
 *
 * @export
 * @interface ILinkedList
 * @template T
 */
export interface ILinkedList<T> {
  /**
   * Get the previous item in the list, or null if last.
   *
   * @returns {(T | undefined)}
   * @memberof ILinkedList
   */
  prev(): T | undefined;

  /**
   * Set the previous item in the list.
   *
   * @param {T} prev
   * @memberof ILinkedList
   */
  prev(prev: T): void;

  /**
   * Get the next item in the list, or null if last.
   *
   * @returns {(T | undefined)}
   * @memberof ILinkedList
   */
  next(): T | undefined;

  /**
   * Set the next item in the list.
   *
   * @param {T} next
   * @memberof ILinkedList
   */
  next(next: T): void;
}
