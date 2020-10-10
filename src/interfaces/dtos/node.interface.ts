import { ITreeModel } from '../tree.interface';

export interface INode extends ITreeModel<INode> {
  content: string;
  type: string;
}
