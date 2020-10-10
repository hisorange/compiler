import { IParser } from '../pipes/parser.interface';

export interface ITokenizer {
  /**
   * Register the identifier and enforce token for the same type.
   *
   * @param {string} reference
   * @param {IParser} parser
   * @returns {IParser}
   * @memberof ITokenizer
   */
  identifier(reference: string, parser: IParser): IParser;

  /**
   * Make the parser result optional for other parser's conditions.
   *
   * @param {IParser} parser
   * @returns {IParser}
   * @memberof ITokenizer
   */
  optional(parser: IParser): IParser;

  /**
   * Match an exact character or sequence of characters.
   *
   * @param {string} literal
   * @returns {IParser}
   * @memberof ITokenizer
   */
  literal(literal: string): IParser;

  /**
   * Match a single character with regex test.
   *
   * @param {RegExp} regex
   * @returns {IParser}
   * @memberof ITokenizer
   */
  regexp(regex: RegExp): IParser;

  /**
   * Match multiple of the given parser in sequence.
   *
   * @param {IParser} parser
   * @returns {IParser}
   * @memberof ITokenizer
   */
  repetition(parser: IParser): IParser;

  /**
   * Match the first parser in the given set.
   *
   * @param {IParser[]} parsers
   * @returns {IParser}
   * @memberof ITokenizer
   */
  or(parsers: IParser[]): IParser;

  /**
   * Concatanate multiple parser's sequential result.
   *
   * @param {IParser[]} parsers
   * @returns {IParser}
   * @memberof ITokenizer
   */
  concat(parsers: IParser[]): IParser;

  /**
   * Resolve an identifier from the symbol map.
   *
   * @param {string} identifier
   * @returns {IParser}
   * @memberof ITokenizer
   */
  resolve(identifier: string): IParser;
}
