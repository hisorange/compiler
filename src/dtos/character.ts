import { CharacterLengthException } from '../exceptions/character-length.exception';
import { ICharacter } from '../interfaces/dtos/character.interface';
import { IPath } from '../interfaces/dtos/path.interface';
import { IPosition } from '../interfaces/dtos/position.interface';
import { Position } from './position';

export class Character implements ICharacter {
  readonly position: IPosition;
  readonly code: number;
  protected _prev: ICharacter;
  protected _next: ICharacter;

  constructor(readonly value: string, readonly path: IPath, line: number, column: number, index: number) {
    this.position = new Position(this, line, column, index);

    if (this.value.length !== 1) {
      throw new CharacterLengthException('Character length cannot be anything else but one', {
        value,
        length: this.value.length,
        position: this.position,
        path,
      });
    }

    this.code = this.value.charCodeAt(0);
  }

  prev(prev?: ICharacter) {
    if (prev) {
      this._prev = prev;
      prev.next(this);
    } else {
      return this._prev;
    }
  }

  next(next?: ICharacter) {
    if (next) {
      this._next = next;
    } else {
      return this._next;
    }
  }
}
