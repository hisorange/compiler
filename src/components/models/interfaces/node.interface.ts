import { ITreeModel } from './tree.interface';

export interface INode extends ITreeModel<INode> {
  type: string;
  channel: string;
  content: string;
}
