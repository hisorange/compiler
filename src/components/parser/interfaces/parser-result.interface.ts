import { ICharacter } from '../../models/interfaces/character.interface';
import { ICollection } from '../../models/interfaces/collection.interface';
import { IToken } from '../../models/interfaces/token.interface';

export interface IParserResult {
  readonly characters: ICollection<ICharacter>;
  readonly token?: IToken;
  readonly optional?: boolean;
}
