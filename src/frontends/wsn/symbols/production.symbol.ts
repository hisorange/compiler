import { Symbol } from '../../../dtos/symbol';
import { ExpressionTree } from '../misc/rule.tree';

export class ProductionSymbol extends Symbol {
  public expressions: ExpressionTree;
}
