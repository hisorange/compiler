import { ICharacter } from '../../models/interfaces/character.interface';
import { ICollection } from '../../models/interfaces/collection.interface';
import { IParserManager } from '../../parser/interfaces/parser-manager.interface';
import { IParserResult } from '../../parser/interfaces/parser-result.interface';

export interface IGrammar {
  readonly id: string;
  readonly tokenizer: IParserManager;

  parse(characters: ICollection<ICharacter>): IParserResult;
}
