import { IToken } from '../../models';
import { ICharacter } from '../../models/interfaces/character.interface';
import { ICollection } from '../../models/interfaces/collection.interface';

export interface IParserResult {
  readonly characters: ICollection<ICharacter>;
  match?: IToken;
  readonly optional?: boolean;
}
