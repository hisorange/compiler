import { ISymbol } from '../iml/interfaces/symbol.interface';

export interface ICompilerInput {
  symbol: ISymbol;
  backendRefs: string[];
}
