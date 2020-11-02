import { ISymbolDataProvider } from './symbol-data-provider.interface';
import { ISymbolData } from './symbol-data.interface';
import { ISymbolName } from './symbol-name.interface';
import { ISymbolId } from './symbol-record.interface';
import { ISymbolTable } from './symbol-table.interface';

export interface ISymbol {
  getMetadata(key: string): any;
  setMetadata(key: string, value: any): void;

  hasParent(): boolean;
  getParent(): ISymbol;
  setParent(parent: ISymbol): void;

  getChildren(): ISymbol[];
  addChildren(...children: ISymbol[]): void;

  /**
   * Symbol's are referenced by their name.
   *
   * @returns {ISymbolName}
   * @memberof ISymbol
   */
  readonly name: ISymbolName;

  getSymbolRecord(): ISymbolId;

  /**
   * Access to the symbol's context data,
   * this data is used for rendering and qualifying.
   *
   * @param {ISymbolData[]} [resolvers]
   * @returns {ISymbolData}
   * @memberof ISymbol
   */
  getData(resolvers?: ISymbolDataProvider[]): ISymbolData;

  /**
   * Register itself, and propagate to it's childrens.
   *
   * @memberof ISymbol
   */
  register(symbolTable: ISymbolTable): void;

  /**
   * Resolve the pending dependencies.
   *
   * @memberof ISymbol
   */
  resolve(): void;
}
