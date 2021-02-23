import { Constructor } from '@loopback/context';
import { ILexer } from '../../../components';
import {
  FieldLexer,
  MessageLexer,
  RPCLexer,
  RPCLogicLexer,
  ServiceLexer,
  SyntaxLexer,
} from './lexers';

// Lexers
export const AMLLexers: Constructor<ILexer>[] = [
  SyntaxLexer,
  ServiceLexer,
  RPCLexer,
  RPCLogicLexer,
  MessageLexer,
  FieldLexer,
];
