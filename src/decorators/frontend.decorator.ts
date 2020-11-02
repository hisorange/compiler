import { ClassDecoratorFactory } from '@loopback/metadata';
import { ITokenizer } from '../interfaces/components/tokenizer.interface';
import { Constructor } from '../interfaces/constructor.interface';
import { IInterpreter } from '../interfaces/pipes/interpreter.interface';
import { ILexer } from '../interfaces/pipes/lexer.interface';

export interface IFrontendMeta {
  name: string;
  reference: string;
  extensions: string[];
  tokenizer?: Constructor<ITokenizer>;
  lexers?: Constructor<ILexer>[];
  interpreters?: Constructor<IInterpreter>[];
  // <3
  author?: {
    name: string;
    email?: string;
    homepage?: string;
  };
}

export function Frontend(spec: IFrontendMeta): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<IFrontendMeta>('artgen.frontend', spec, { decoratorName: '@Frontend' });
}
