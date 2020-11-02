import { IFileSystem } from '@artgen/file-system';
import { Bindings } from '../constants/bindings';
import { Container } from '../container';
import { Inject } from '../decorators/inject.decorator';
import { IPath } from '../interfaces/dtos/path.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';

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
