import { ICollection } from '../interfaces/collection.interface';

export class Collection<T> implements ICollection<T> {
  /**
   * Implement a hidden cursor.
   *
   * @protected
   * @type {number}
   * @memberof Collection
   */
  protected _cursor: number = 0;

  /**
   * Buffer the item collection's length.
   *
   * @protected
   * @type {number}
   * @memberof Collection
   */
  protected _length: number = 0;

  /**
   * Initialize a new collection.
   *
   * @param {T[]} _items
   * @memberof Collection
   */
  constructor(protected readonly _items: T[] = []) {
    this._length = _items.length;
  }

  /**
   * @inheritdoc
   */
  push(item: T): this {
    this._items.push(item);
    this._length++;

    return this;
  }

  /**
   * @inheritdoc
   */
  get items(): T[] {
    return this._items;
  }

  /**
   * @inheritdoc
   */
  get cursor(): number {
    return this._cursor;
  }

  /**
   * @inheritdoc
   */
  get isValid(): boolean {
    return this._length - 1 >= this._cursor;
  }

  /**
   * @inheritdoc
   */
  get empty(): boolean {
    return this._length === 0;
  }

  /**
   * @inheritdoc
   */
  get current(): T | undefined {
    if (this._cursor <= this._length - 1) {
      return this._items[this._cursor];
    } else {
      return undefined;
    }
  }

  /**
   * @inheritdoc
   */
  get next(): T | undefined {
    if (this._cursor + 1 < this._length) {
      return this._items[this._cursor + 1];
    } else {
      return undefined;
    }
  }

  /**
   * @inheritdoc
   */
  get prev(): T | undefined {
    if (this._cursor - 1 >= 0) {
      return this._items[this._cursor - 1];
    } else {
      return undefined;
    }
  }

  /**
   * @inheritdoc
   */
  advance(steps: number = 1): this {
    this._cursor += steps;
    return this;
  }

  /**
   * @inheritdoc
   */
  rewind(position: number): this {
    this._cursor = position;
    return this;
  }

  /**
   * @inheritdoc
   */
  get length(): number {
    return this._length;
  }

  /**
   * @inheritdoc
   */
  consume(amount: number = 1): T[] {
    return this.advance(amount)._items.slice(this._cursor - amount, this._cursor);
  }

  /**
   * @inheritdoc
   */
  slice(start: number, length: number = 1): T[] {
    return this._items.slice(start, start + length);
  }

  /**
   * @inheritdoc
   */
  clone(): ICollection<T> {
    return new Collection(this._items).advance(this.cursor);
  }
}
