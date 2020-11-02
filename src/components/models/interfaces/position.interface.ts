import { ICharacter } from './character.interface';

export interface IPosition {
  /**
   * Line indxe.
   *
   * @type {number}
   */
  readonly line: number;

  /**
   * Column index.
   *
   * @type {number}
   */
  readonly column: number;

  /**
   * Absolute index.
   *
   * @type {number}
   */
  readonly index: number;

  /**
   * Character bound to.
   *
   * @type {ICharacter}
   */
  readonly character: ICharacter;
}
