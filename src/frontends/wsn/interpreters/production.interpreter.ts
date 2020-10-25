import { INode } from '../../../interfaces/dtos/node.interface';
import { ISymbol } from '../../../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../../../interfaces/pipes/interpreter.interface';
import { ExpressionTree } from '../misc/rule.tree';
import { ProductionSymbol } from '../symbols/production.symbol';

export class ProductionInterpreter implements IInterpreter {
  interest() {
    return ['PRODUCTION'];
  }

  visit(ctx: ISymbol, node: INode): ISymbol {
    const name = node.content;
    const sym = new ProductionSymbol(name);
    ctx.addChildren(sym);

    let expr: ExpressionTree = new ExpressionTree('IDENTIFIER', name);
    sym.expressions = expr;

    node.getChildren().forEach(child => this.convert(expr, child));

    return sym;
  }

  protected convert(ctx: ExpressionTree, node: INode): ExpressionTree {
    let type = node.type;

    if (type === 'IDENTIFIER') {
      if (!node.hasParent() || node.getParent().type === 'OR_GROUP' || node.getParent().type === 'IDENTIFIER') {
        if (node.getParent().getParent().type === 'SYNTAX') {
          type = 'ALIAS';
        }
      }
    }

    ctx = new ExpressionTree(type, node.content).setParent(ctx);

    node.getChildren().forEach(child => this.convert(ctx, child));

    return ctx;
  }
}
