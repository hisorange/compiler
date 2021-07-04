import { INode } from './interfaces/node.interface';
import { TreeModel } from './tree.model';

export class Node extends TreeModel<Node> implements INode {
  constructor(
    readonly type: string,
    readonly channel: string,
    protected _content: string = '',
  ) {
    super();
  }

  get content(): string {
    return this._content;
  }
}
