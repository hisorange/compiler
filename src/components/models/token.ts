import { ICharacter } from './interfaces/character.interface';
import { IPathAware } from './interfaces/path-aware.interface';
import { IPath } from './interfaces/path.interface';
import { IToken } from './interfaces/token.interface';
import { TreeModel } from './tree.model';

export class GrammarToken
  extends TreeModel<GrammarToken>
  implements IToken, IPathAware
{
  protected _prev: IToken;
  protected _next: IToken;

  constructor(
    readonly characters: ICharacter[],
    public type: string,
    readonly channel: string = 'main',
  ) {
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

  clearSyntaxTokens(): void {
    this.children = this.children.filter(c => c instanceof GrammarToken);
  }
}
