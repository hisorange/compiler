import { Node } from '../../../dtos/node';
import { IToken } from '../../../interfaces/dtos/token.interface';
import { ILexer } from '../../../interfaces/pipes/lexer.interface';
import { AMLIdentifier } from '../aml.identifiers';

export class FieldLexer implements ILexer {
  interest() {
    return [AMLIdentifier.FIELD];
  }

  enter(ctx: Node, token: IToken) {
    return new Node(
      AMLIdentifier.FIELD,
      token.getChildren().find(t => t.type === AMLIdentifier.FIELD_NAME)?.content,
    ).setParent(ctx);
  }

  exit(ctx: Node, token: IToken) {
    return ctx.getParent();
  }
}
