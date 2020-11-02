import { IFileSystem } from '@artgen/file-system';
import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { IPipe } from '../pipes/interfaces/pipe.interface';
import { IGeneratorJob } from './generator-job.interface';
import { GeneratorPipe } from './generator.pipe';

export class GeneratorPipeline implements IPipe<IGeneratorJob, Promise<IFileSystem>> {
  constructor(
    @Inject(Bindings.Pipe.Generator)
    protected readonly generator: GeneratorPipe,
  ) {}

  async pipe(input: IGeneratorJob): Promise<IFileSystem> {
    return this.generator.pipe(input);
  }
}
