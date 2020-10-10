import { GenericSymbolDataResolver } from '../iml/symbol-data.provider';
import { SymbolDataProxy } from '../iml/symbol-data.proxy';
import { ISymbolName } from '../interfaces/dtos/symbol-name.interface';
import { ISymbol } from '../interfaces/dtos/symbol.interface';
import { ISymbolDataProvider } from '../interfaces/symbol-data-provider.interface';
import { ISymbolData } from '../interfaces/symbol-data.interface';
import { ISymbolMetadata } from '../interfaces/symbol-metadata.interface';
import { ISymbolId } from '../interfaces/symbol-record.interface';
import { ISymbolTable } from '../interfaces/symbol-table.interface';
import { TreeModel } from '../models/tree.model';
import { SymbolName } from './symbol-name';

export class Symbol extends TreeModel<Symbol> implements ISymbol {
  /**
   * Definition reference for the symbol, for example
   * "class MyClass" the name will be the "MyClass"
   *
   * @protected
   * @type {ISymbolName}
   * @memberof Symbol
   */
  protected symbolName: ISymbolName;

  /**
   * Special store for meta data extensions.
   *
   * @protected
   * @type {ISymbolMetadata}
   * @memberof Symbol
   */
  protected meta: ISymbolMetadata = {};

  protected symbolRecord: ISymbolId;

  constructor(name: string) {
    super();
    this.symbolName = new SymbolName(this, name);
  }

  getMetadata(key: string): any {
    return this.meta[key];
  }

  setMetadata(key: string, value: any): void {
    this.meta[key] = value;
  }

  get name(): ISymbolName {
    if (typeof this.symbolName === 'undefined') {
      this.symbolName = new SymbolName(
        this,
        'NA' + Math.random().toString().replace('.', ''),
      );
    }

    return this.symbolName;
  }

  getData(resolvers: ISymbolDataProvider[] = []): ISymbolData {
    // Push the generic resolver into the array so it propagetes to every leaf.
    if (!resolvers.find(r => r instanceof GenericSymbolDataResolver)) {
      resolvers.push(new GenericSymbolDataResolver());
    }

    return SymbolDataProxy(this, resolvers);
  }

  getSymbolRecord(): ISymbolId {
    return this.symbolRecord;
  }

  register(symbolTable: ISymbolTable): void {
    this.symbolRecord = symbolTable.register(this);

    for (const child of this.children) {
      child.register(symbolTable);
    }
  }

  resolve(): void {
    for (const child of this.children) {
      child.resolve();
    }
  }
}
