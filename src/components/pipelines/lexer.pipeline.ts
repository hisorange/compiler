import { Bindings } from '../container/bindings';
import { Container } from '../container/container';
import { INode } from '../models/interfaces/node.interface';
import { IPath } from '../models/interfaces/path.interface';
import { IPipe } from '../pipes/interfaces/pipe.interface';

export class LexerPipeline implements IPipe<IPath, Promise<INode>> {
  constructor(protected readonly container: Container) {}

  async pipe(input: IPath): Promise<INode> {
    const reader = this.container.getSync(Bindings.Pipe.Reader);
    const parser = this.container.getSync(Bindings.Pipe.Parser);
    const lexer = this.container.getSync(Bindings.Pipe.Lexer);

    return lexer.pipe(await parser.pipe(await reader.pipe(input)));
  }
}
