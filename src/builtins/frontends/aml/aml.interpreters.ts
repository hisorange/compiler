import { Constructor } from '@loopback/context';
import { IInterpreter } from '../../../components';
import {
  FieldInterpreter,
  MessageInterpreter,
  RPCInterpreter,
  RPCLogicInterpreter,
  ServiceInterpreter,
  SyntaxInterpreter,
} from './interpreters';

// Interpreters
export const AMLInterpreters: Constructor<IInterpreter>[] = [
  SyntaxInterpreter,
  ServiceInterpreter,
  RPCInterpreter,
  RPCLogicInterpreter,
  MessageInterpreter,
  FieldInterpreter,
];
