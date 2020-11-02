import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';
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
