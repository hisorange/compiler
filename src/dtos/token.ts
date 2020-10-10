import { ICharacter } from '../interfaces/dtos/character.interface';
import { IPathAware } from '../interfaces/dtos/path-aware.interface';
import { IPath } from '../interfaces/dtos/path.interface';
import { IToken } from '../interfaces/dtos/token.interface';
import { TreeModel } from '../models/tree.model';

export class Token extends TreeModel<Token> implements IToken, IPathAware {
  protected _prev: IToken;
  protected _next: IToken;

  constructor(readonly characters: ICharacter[], public type: string) {
    super();
  }

  get length(): number {
    return this.getChildren()
      .map(child => child.length)
      .reduce((a, b) => a + b, this.characters.length);
  }

  get content(): string {
    return this.getChildren()
      .map(child => child.content)
      .join('')
      .concat(...this.characters.map(c => c.value));
  }

  get path(): IPath {
    return this.characters[0].path;
  }
}
