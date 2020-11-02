import { ILinkedList } from './linked-list.interface';
import { IPathAware } from './path-aware.interface';
import { IPosition } from './position.interface';

/**
 * Character carries the single character read from the path.
 * This is used to create token sequences.
 *
 * @export
 * @interface ICharacter
 */
export interface ICharacter extends IPathAware, ILinkedList<ICharacter> {
  /**
   * Single UTF-16 character.
   *
   * @returns {string}
   * @memberof ICharacter
   */
  readonly value: string;

  /**
   * Get the character code.
   *
   * @returns {number}
   * @memberof ICharacter
   */
  readonly code: number;

  /**
   * Position in the file it was read from.
   *
   * @returns {IPosition}
   * @memberof ICharacter
   */
  readonly position: IPosition;
}
