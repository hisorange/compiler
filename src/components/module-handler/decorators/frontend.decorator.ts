import { ClassDecoratorFactory } from '@loopback/metadata';
import { Constructor } from '../../container/interfaces/constructor.interface';
import { ITokenizer } from '../../parser/interfaces/tokenizer.interface';
import { IInterpreter } from '../../pipes/interfaces/interpreter.interface';
import { ILexer } from '../../pipes/interfaces/lexer.interface';

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
