import { IFileSystem } from '@artgen/file-system';
import { Bindings } from '../constants/bindings';
import { IContainer } from '../interfaces/container.interface';
import { IPath } from '../interfaces/dtos/path.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';

export class CompilerPipeline implements IPipe<IPath, Promise<IFileSystem>> {
  constructor(protected readonly container: IContainer) {}

  async pipe(input: IPath): Promise<IFileSystem> {
    const reader = this.container.getSync(Bindings.Pipe.Reader);
    const parser = this.container.getSync(Bindings.Pipe.Parser);
    const lexer = this.container.getSync(Bindings.Pipe.Lexer);
    const intepreter = this.container.getSync(Bindings.Pipe.Interpreter);
    const compiler = this.container.getSync(Bindings.Pipe.Compiler);

    return compiler.pipe(
      await intepreter.pipe(
        await lexer.pipe(await parser.pipe(await reader.pipe(input))),
      ),
    );
  }
}
