import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';
import { AMLIdentifier } from '../aml.identifiers';

export class RPCLexer implements ILexer {
  interest() {
    return [AMLIdentifier.RPC];
  }

  enter(ctx: Node, token: IToken) {
    return new Node(
      AMLIdentifier.RPC,
      token.getChildren().find(t => t.type === AMLIdentifier.RPC_NAME)?.content,
    ).setParent(ctx);
  }

  exit(ctx: Node, token: IToken) {
    return ctx.getParent();
  }
}
