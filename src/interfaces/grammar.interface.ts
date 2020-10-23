import { ICollection } from './collection.interface';
import { ITokenizer } from './components/tokenizer.interface';
import { ICharacter } from './dtos/character.interface';
import { IParserResult } from './parser-result.interface';

export interface IGrammar {
  readonly id: string;
  readonly tokenizer: ITokenizer;

  parse(characters: ICollection<ICharacter>): IParserResult;
}
