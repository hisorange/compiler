import { ICharacter, ICollection, INode } from '../../models';

interface IMatchSuccess {
  node: INode;
  characters: ICollection<ICharacter>;
}

export type IFragmentParserResult = IMatchSuccess | false;
