import { TreeModel } from '../../models/tree.model';

export class ExpressionTree extends TreeModel<ExpressionTree> {
  constructor(readonly type: string, readonly value?: string) {
    super();
  }
}
