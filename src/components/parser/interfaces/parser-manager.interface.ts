import { ICharacter } from '../../models/interfaces/character.interface';
import { IParser } from './parser.interface';

export interface IParserManager {
  /**
   * Register a parser.
   *
   * @param {string} reference
   * @param {IParser} parser
   * @returns {IParser}
   */
  addSyntax(reference: string, parser: IParser, channel?: string): IParser;
  addToken(reference: string, tokenizer: IParser, channel?: string): IParser;

  /**
   * Make the parser result optional for other parser's conditions.
   *
   * @param {IParser} parser
   * @returns {IParser}
   */
  optional(parser: IParser): IParser;

  /**
   * Match an exact character or sequence of characters.
   *
   * @param {string} literal
   * @returns {IParser}
   */
  literal(literal: string): IParser;

  /**
   * Match a single character with regex test.
   *
   * @param {RegExp} regex
   * @returns {IParser}
   */
  regexp(regex: RegExp): IParser;

  /**
   * Match multiple of the given parser in sequence.
   *
   * @param {IParser} parser
   * @returns {IParser}
   */
  repetition(parser: IParser): IParser;

  /**
   * Match the first parser in the given set.
   *
   * @param {IParser[]} parsers
   * @returns {IParser}
   */
  or(parsers: IParser[]): IParser;

  /**
   * Concatanate multiple parser's sequential result.
   *
   * @param {IParser[]} parsers
   * @returns {IParser}
   */
  concat(parsers: IParser[]): IParser;

  /**
   * Resolve an identifier from the symbol map.
   *
   * @param {string} identifier
   * @returns {IParser}
   */
  resolve(identifier: string): IParser;

  prepare(): void;
  lastParserCharacter(): ICharacter | null;
}
