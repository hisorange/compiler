import { ICharacter } from './character.interface';
import { ITreeModel } from './tree.interface';

export interface IToken extends ITreeModel<IToken> {
  /**
   * Accessor the underlying character set.
   *
   * @type {ICharacter[]}
   * @memberof IToken
   */
  readonly characters: ICharacter[];

  /**
   * Get the concatanted characters as a string.
   *
   * @type {string}
   * @memberof IToken
   */
  readonly content: string;

  /**
   * Get the concatanted characters length.
   *
   * @type {number}
   * @memberof IToken
   */
  readonly length: number;

  /**
   * Target channel.
   *
   * @type {string}
   */
  readonly channel: string;

  /**
   * Use a single token instance with token types as identifier,
   * this allows the dynamic creation of new token types.
   *
   * @type {string}
   * @memberof IToken
   */
  type: string;

  clearSyntaxTokens(): void;
}
