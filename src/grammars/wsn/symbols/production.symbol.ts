import { Symbol } from '../../../dtos/symbol';
import { ExpressionTree } from '../rule.tree';

export class ProductionSymbol extends Symbol {
  public expressions: ExpressionTree;
}
