import { ClassDecoratorFactory } from '@loopback/metadata';
import { Constructor } from '../interfaces/constructor.interface';
import { ISymbol } from '../interfaces/dtos/symbol.interface';
import { ITemplate } from '../interfaces/template.interface';

export interface IBackendMeta {
  name: string;
  reference: string;
  templates?: Constructor<ITemplate>[];
  // <3
  author?: {
    name: string;
    email?: string;
    homepage?: string;
  };
  interest: (symbol: ISymbol) => boolean;
}

export function Backend(spec: IBackendMeta): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<IBackendMeta>('artgen.backend', spec, { decoratorName: '@Backend' });
}
