import { IInterpreter } from '../../interfaces/pipes/interpreter.interface';
import { FieldInterpreter } from './interpreters/field.interpreter';
import { MessageInterpreter } from './interpreters/message.interpreter';
import { RPCLogicInterpreter } from './interpreters/rpc-logic.interpreter';
import { RPCInterpreter } from './interpreters/rpc.interpreter';
import { ServiceInterpreter } from './interpreters/service.interpreter';
import { SyntaxInterpreter } from './interpreters/syntax.interpreter';

// Interpreters
export const AMLInterpreters: IInterpreter[] = [
  new SyntaxInterpreter(),
  new ServiceInterpreter(),
  new RPCInterpreter(),
  new RPCLogicInterpreter(),
  new MessageInterpreter(),
  new FieldInterpreter(),
];
