import { CompilerException } from '../exceptions/compiler.exception';
import { ISymbolDataProvider } from './interfaces/symbol-data-provider.interface';
import {
  ISymbolData,
  ISymbolDataCreator,
  ISymbolDataTypes,
} from './interfaces/symbol-data.interface';
import { ISymbol } from './interfaces/symbol.interface';

export function SymbolDataProxy(
  symbol: ISymbol,
  providers: ISymbolDataProvider[] = [],
  base = {},
): ISymbolData {
  for (const provider of providers) {
    // Check if the provider is intersted in this type of symbol.
    if (provider.filter(symbol)) {
      const result = provider.resolve(providers);

      for (const prop in result) {
        if (result.hasOwnProperty(prop)) {
          base[prop] = result[prop] as ISymbolData;
        }
      }
    }
  }

  return new Proxy(
    {},
    {
      get: (target, property: string) => {
        // Skip on symbols.
        if (typeof property === 'symbol' || property === 'inspect') {
          return null;
        }

        if (base.hasOwnProperty(property)) {
          const value = base[property] as unknown;

          switch (typeof value) {
            case 'function':
              return (value as ISymbolDataCreator<ISymbolDataTypes>)(
                symbol,
                providers,
              );
            case 'string':
            case 'number':
              return value;
            case 'object':
              return SymbolDataProxy(symbol, providers, value);
            default:
              throw new CompilerException(
                `Symbol [${symbol.constructor.name}] property [${property}] is not resolvable.`,
              );
          }
        } else {
          throw new CompilerException(
            `Symbol [${symbol.constructor.name}] does not have [${property}] named property.`,
            {
              properties: Object.keys(base),
            },
          );
        }
      },
    },
  );
}
