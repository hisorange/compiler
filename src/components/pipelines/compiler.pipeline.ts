import { IFileSystem } from '@artgen/file-system';
import { Bindings } from '../container/bindings';
import { Container } from '../container/container';
import { Inject } from '../container/decorators/inject.decorator';
import { IPath } from '../models/interfaces/path.interface';
import { IPipe } from '../pipes/interfaces/pipe.interface';

export class CompilerPipeline implements IPipe<IPath, Promise<IFileSystem>> {
  constructor(
    @Inject(Bindings.Container)
    protected readonly container: Container,
  ) {}

  async pipe(input: IPath): Promise<IFileSystem> {
    const reader = this.container.getSync(Bindings.Pipe.Reader);
    const parser = this.container.getSync(Bindings.Pipe.Parser);
    const lexer = this.container.getSync(Bindings.Pipe.Lexer);
    const intepreter = this.container.getSync(Bindings.Pipe.Interpreter);
    const compiler = this.container.getSync(Bindings.Pipe.Compiler);

    return compiler.pipe(await intepreter.pipe(await lexer.pipe(await parser.pipe(await reader.pipe(input)))));
  }
}
