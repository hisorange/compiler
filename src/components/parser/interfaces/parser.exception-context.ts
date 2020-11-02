import { IGrammar } from '../../iml/interfaces/grammar.interface';
import { ICharacter } from '../../models/interfaces/character.interface';
import { ICollection } from '../../models/interfaces/collection.interface';

export interface IParserExceptionContext {
  grammar: IGrammar;
  characters: ICollection<ICharacter>;
}
