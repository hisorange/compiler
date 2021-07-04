import { ICharacter, ICollection } from '../../models';
import { IFragmentParserResult } from './fragment-parser-result.interface';

export type IFragmentParser = (
  characters: ICollection<ICharacter>,
) => IFragmentParserResult;
