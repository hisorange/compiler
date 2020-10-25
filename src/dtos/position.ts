import { InvalidPositionException } from '../exceptions/invalid-position.exception';
import { ICharacter } from '../interfaces/dtos/character.interface';
import { IPosition } from '../interfaces/dtos/position.interface';

export class Position implements IPosition {
  constructor(readonly character: ICharacter, readonly line: number, readonly column: number, readonly index: number) {
    if (line < 0) {
      throw new InvalidPositionException('Line number cannot be less than zero!', {
        line,
        column,
        character,
      });
    }

    if (column < 0) {
      throw new InvalidPositionException('Column number cannot be less than zero!', {
        line,
        column,
        character,
      });
    }
  }
}
