import { ICharacter } from '../../models/interfaces/character.interface';
import { ICollection } from '../../models/interfaces/collection.interface';
import { IParserResult } from '../../parser/interfaces/parser-result.interface';
import { ITokenizer } from '../../parser/interfaces/tokenizer.interface';

export interface IGrammar {
  readonly id: string;
  readonly tokenizer: ITokenizer;

  parse(characters: ICollection<ICharacter>): IParserResult;
}
