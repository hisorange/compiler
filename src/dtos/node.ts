import { INode } from '../interfaces/dtos/node.interface';
import { TreeModel } from '../models/tree.model';

export class Node extends TreeModel<Node> implements INode {
  constructor(readonly type: string, protected _content: string = '') {
    super();
  }

  get content(): string {
    return this._content;
  }
}
