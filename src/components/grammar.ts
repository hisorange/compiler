import { ICollection } from '../interfaces/collection.interface';
import { ICharacter } from '../interfaces/dtos/character.interface';
import { IGrammar } from '../interfaces/grammar.interface';
import { IParserResult } from '../interfaces/parser-result.interface';
import { Tokenizer } from './tokenizer';

export class Grammar implements IGrammar {
  constructor(
    readonly id: string,
    readonly tokenizer: Tokenizer,
    readonly extension: string,
  ) {}

  parse(characters: ICollection<ICharacter>): IParserResult {
    return this.tokenizer.resolve('SYNTAX')(characters);
  }
}
