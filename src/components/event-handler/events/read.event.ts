import { ICharacter } from '../../models/interfaces/character.interface';
import { ICollection } from '../../models/interfaces/collection.interface';
import { IPath } from '../../models/interfaces/path.interface';

export interface ReadEvent {
  readonly path: IPath;
  readonly characters: ICollection<ICharacter>;
}
