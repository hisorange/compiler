import { ClassDecoratorFactory } from '@loopback/metadata';

export interface IGrammar {
  name: string;
  extensions: string[];
  version: string;

  // <3
  author?: {
    name: string;
    email?: string;
    homepage?: string;
  };
}

export function Grammar(spec: IGrammar): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<IGrammar>(
    'artgen.grammar',
    spec,
    { decoratorName: '@Grammar' },
  );
}
