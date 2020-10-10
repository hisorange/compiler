import { ICollection } from './collection.interface';
import { ICharacter } from './dtos/character.interface';
import { IToken } from './dtos/token.interface';

export interface IParserResult {
  readonly characters: ICollection<ICharacter>;
  readonly token?: IToken;
  readonly optional?: boolean;
}
