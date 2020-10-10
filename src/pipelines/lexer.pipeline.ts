import { Bindings } from '../constants/bindings';
import { IContainer } from '../interfaces/container.interface';
import { INode } from '../interfaces/dtos/node.interface';
import { IPath } from '../interfaces/dtos/path.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';

export class LexerPipeline implements IPipe<IPath, Promise<INode>> {
  constructor(protected readonly container: IContainer) {}

  async pipe(input: IPath): Promise<INode> {
    const reader = this.container.getSync(Bindings.Pipe.Reader);
    const parser = this.container.getSync(Bindings.Pipe.Parser);
    const lexer = this.container.getSync(Bindings.Pipe.Lexer);

    return lexer.pipe(await parser.pipe(await reader.pipe(input)));
  }
}
