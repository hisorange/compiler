import { Tokenizer } from '../components/tokenizer.old';
import { ICollection } from './collection.interface';
import { ICharacter } from './dtos/character.interface';
import { IParserResult } from './parser-result.interface';

export interface IGrammar {
  readonly id: string;
  readonly tokenizer: Tokenizer;
  readonly extension: string;

  parse(characters: ICollection<ICharacter>): IParserResult;
}
