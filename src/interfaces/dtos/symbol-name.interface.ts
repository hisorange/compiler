import { IStringCase } from '@artgen/string-case';

export interface ISymbolName extends IStringCase {
  /**
   * Fully qualified name concataned with the parent symbol's name.
   */
  readonly fqn: ISymbolName;
}
