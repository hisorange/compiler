import { INode } from '../../../../components/models/interfaces/node.interface';
import { IToken } from '../../../../components/models/interfaces/token.interface';
import { Node } from '../../../../components/models/node';
import { ILexer } from '../../../../components/pipes/interfaces/lexer.interface';

export class ProductionLexer implements ILexer {
  interest() {
    return ['PRODUCTION'];
  }

  enter(ctx: Node, token: IToken) {
    return new Node(
      'PRODUCTION',
      token.getChildren().find(t => t.type === 'IDENTIFIER').content,
    ).setParent(ctx);
  }

  exit(ctx: Node, token: IToken) {
    this.concat(ctx);
    this.or(ctx);
    this.logicalGroup(ctx);

    return ctx.getParent();
  }

  logicalGroup(ctx: Node) {
    const newChildren: Node[] = [];

    for (const child of ctx.getChildren()) {
      if (child.type === 'LOGICAL_GROUP') {
        newChildren.push(...child.getChildren().map(c => this.logicalGroup(c)));
      } else {
        newChildren.push(child);
      }
    }

    ctx.setChildren(...newChildren);

    ctx.getChildren().forEach(c => this.logicalGroup(c));

    return ctx;
  }

  or(ctx: Node) {
    // Optimize OR groups.
    if (ctx.getChildren().find(n => n.type === 'OR')) {
      const orOp = new Node('OR_GROUP');

      for (const child of ctx.getChildren()) {
        if (child.type !== 'OR') {
          child.setParent(orOp);
        }
      }

      ctx.setChildren(orOp);
    }

    ctx.getChildren().forEach(b => this.or(b));
  }

  concat(ctx: Node) {
    const testConcat = (c: INode) =>
      [
        'LITERAL',
        'IDENTIFIER',
        'REPETITION',
        'CONCAT',
        'OPTIONAL',
        'LOGICAL_GROUP',
      ].includes(c.type);

    // Concatante
    if (ctx.getChildren().filter(testConcat).length > 1) {
      let cGroup: Node;
      const oldChildren = ctx.getChildren();
      const newChildren: Node[] = [];

      for (let i = 0; i < oldChildren.length; i++) {
        const child = oldChildren[i];

        // Concatable
        if (testConcat(child)) {
          // More child in the line
          if (i + 1 < oldChildren.length) {
            // Next child is concatable, start the group.
            if (testConcat(oldChildren[i + 1])) {
              // Start the concat group.
              if (!cGroup) {
                cGroup = new Node('CONCAT');
                newChildren.push(cGroup);
              }
            }
          }

          if (cGroup) {
            cGroup.addChildren(child);
          } else {
            newChildren.push(child);
          }
        } else {
          // Run out of child in the line
          if (cGroup) {
            cGroup = null;
          }

          newChildren.push(child);
        }
      }

      ctx.setChildren(...newChildren);
    }

    ctx
      .getChildren()
      .forEach(c => c.getChildren().forEach(b => this.concat(b)));
  }
}
