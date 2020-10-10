import { Node } from '../../../dtos/node';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { ILexer } from '../../../interfaces/pipes/lexer.interface';
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
