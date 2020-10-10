import { ICollection } from '../collection.interface';
import { ICharacter } from '../dtos/character.interface';
import { IParserResult } from '../parser-result.interface';

export type IParser = (chars: ICollection<ICharacter>) => IParserResult;
