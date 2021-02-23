import { ISymbol } from '../../../../components/iml/interfaces/symbol.interface';
import { INode } from '../../../../components/models/interfaces/node.interface';
import { IInterpreter } from '../../../../components/pipes/interfaces/interpreter.interface';
import { ExpressionTree } from '../misc/expression.tree';
import { ProductionSymbol } from '../symbols/production.symbol';
import { WSNIdentifier } from '../wsn.identifier';

export class ProductionInterpreter implements IInterpreter {
  interest() {
    return ['PRODUCTION'];
  }

  visit(ctx: ISymbol, node: INode): ISymbol {
    const name = node.content;
    const sym = new ProductionSymbol(name);
    ctx.addChildren(sym);

    let channel = node
      .getChildren()
      .find(c => c.type === WSNIdentifier.CHANNEL);

    let expr: ExpressionTree = new ExpressionTree(
      'IDENTIFIER',
      name,
      channel ? channel.content : `main`,
    );
    sym.expressions = expr;

    node.getChildren().forEach(child => this.convert(expr, child));

    return sym;
  }

  protected convert(ctx: ExpressionTree, node: INode): ExpressionTree {
    ctx = new ExpressionTree(node.type, node.content).setParent(ctx);

    node.getChildren().forEach(child => this.convert(ctx, child));

    return ctx;
  }
}
