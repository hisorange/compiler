import { Constructor } from '@loopback/context';
import { ILexer } from '../../interfaces/pipes/lexer.interface';
import { FieldLexer } from './lexers/field.lexer';
import { MessageLexer } from './lexers/message.lexer';
import { RPCLogicLexer } from './lexers/rpc-logic.lexer';
import { RPCLexer } from './lexers/rpc.lexer';
import { ServiceLexer } from './lexers/service.lexer';
import { SyntaxLexer } from './lexers/syntax.lexer';

// Lexers
export const AMLLexers: Constructor<ILexer>[] = [
  SyntaxLexer,
  ServiceLexer,
  RPCLexer,
  RPCLogicLexer,
  MessageLexer,
  FieldLexer,
];
