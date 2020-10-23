import { Node } from '../../../dtos/node';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { ILexer } from '../../../interfaces/pipes/lexer.interface';
import { AMLIdentifier } from '../aml.identifiers';

export class SyntaxLexer implements ILexer {
  interest() {
    return [AMLIdentifier.SYNTAX];
  }

  enter(ctx: Node, token: IToken) {
    return new Node(AMLIdentifier.SYNTAX).setParent(ctx);
  }

  exit(ctx: Node, token: IToken) {
    return ctx.getParent();
  }
}
