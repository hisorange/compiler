import { ICompilerJob } from '../compiler/compiler-job.interface';
import { Bindings } from '../container/bindings';
import { Container } from '../container/container';
import { Inject } from '../container/decorators/inject.decorator';
import { IFileSystem } from '../file-system';
import { IPipe } from '../pipes/interfaces/pipe.interface';

export class CompilerPipeline implements IPipe<ICompilerJob, Promise<IFileSystem>> {
  constructor(
    @Inject(Bindings.Container)
    protected readonly container: Container,
  ) {}

  async pipe(job: ICompilerJob): Promise<IFileSystem> {
    const reader = this.container.getSync(Bindings.Pipe.Reader);
    const parser = this.container.getSync(Bindings.Pipe.Parser);
    const lexer = this.container.getSync(Bindings.Pipe.Lexer);
    const intepreter = this.container.getSync(Bindings.Pipe.Interpreter);
    const compiler = this.container.getSync(Bindings.Pipe.Compiler);

    return compiler.pipe({
      symbol: await intepreter.pipe(await lexer.pipe(await parser.pipe(await reader.pipe(job.input)))),
      backendRefs: job.backendRefs,
    });
  }
}
