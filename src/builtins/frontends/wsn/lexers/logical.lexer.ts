import { INode } from '../../../../components/models/interfaces/node.interface';
import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';

export class LogicalLexer implements ILexer {
  interest() {
    return ['$LITERAL'];
  }

  enter(ctx: Node, token: IToken): INode {
    if (token.content === '{') {
      return new Node('REPETITION').setParent(ctx);
    } else if (token.content === '|') {
      return ctx.addChildren(new Node('OR'));
    } else if (token.content === '[') {
      return new Node('OPTIONAL').setParent(ctx);
    } else if (token.content === '(') {
      return new Node('LOGICAL_GROUP').setParent(ctx);
    } else if (
      token.content === ')' ||
      token.content === '}' ||
      token.content === ']'
    ) {
      return ctx.getParent();
    }

    return ctx;
  }

  exit(ctx: Node, token: IToken) {
    return ctx;
  }
}
