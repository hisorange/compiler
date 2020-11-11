import { ISmartString } from '../../smart-string';

export interface ISymbolName extends ISmartString {
  /**
   * Fully qualified name concataned with the parent symbol's name.
   */
  readonly fqn: ISymbolName;
}
