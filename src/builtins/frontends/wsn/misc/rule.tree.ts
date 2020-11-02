import { TreeModel } from '../../../../components/models/tree.model';

export class ExpressionTree extends TreeModel<ExpressionTree> {
  constructor(readonly type: string, readonly value?: string) {
    super();
  }
}
