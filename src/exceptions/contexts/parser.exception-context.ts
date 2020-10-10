import { ICollection } from '../../interfaces/collection.interface';
import { ICharacter } from '../../interfaces/dtos/character.interface';
import { IGrammar } from '../../interfaces/grammar.interface';

export interface IParserExceptionContext {
  grammar: IGrammar;
  characters: ICollection<ICharacter>;
}
