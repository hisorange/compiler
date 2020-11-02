import { ICharacter } from '../models/interfaces/character.interface';
import { ICollection } from '../models/interfaces/collection.interface';
import { IParserResult } from '../parser/interfaces/parser-result.interface';
import { ITokenizer } from '../parser/interfaces/tokenizer.interface';
import { IGrammar } from './interfaces/grammar.interface';

export class Grammar implements IGrammar {
  constructor(readonly id: string, readonly tokenizer: ITokenizer) {}

  parse(characters: ICollection<ICharacter>): IParserResult {
    return this.tokenizer.resolve('SYNTAX')(characters);
  }
}
