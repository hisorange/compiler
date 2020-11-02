import { ICollection } from '../interfaces/collection.interface';
import { ITokenizer } from '../interfaces/components/tokenizer.interface';
import { ICharacter } from '../interfaces/dtos/character.interface';
import { IGrammar } from '../interfaces/grammar.interface';
import { IParserResult } from '../interfaces/parser-result.interface';

export class Grammar implements IGrammar {
  constructor(readonly id: string, readonly tokenizer: ITokenizer) {}

  parse(characters: ICollection<ICharacter>): IParserResult {
    return this.tokenizer.resolve('SYNTAX')(characters);
  }
}
