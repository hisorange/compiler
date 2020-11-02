import { ICharacter } from '../../models/interfaces/character.interface';
import { ICollection } from '../../models/interfaces/collection.interface';
import { IParserResult } from './parser-result.interface';

export type IParser = (chars: ICollection<ICharacter>) => IParserResult;
