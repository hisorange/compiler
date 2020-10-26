import { IFileSystem } from '@artgen/file-system';
import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { IGeneratorJob } from '../interfaces/generator-job.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';
import { GeneratorPipe } from '../pipes/generator.pipe';

export class GeneratorPipeline implements IPipe<IGeneratorJob, Promise<IFileSystem>> {
  constructor(
    @Inject(Bindings.Pipe.Generator)
    protected readonly generator: GeneratorPipe,
  ) {}

  async pipe(input: IGeneratorJob): Promise<IFileSystem> {
    return this.generator.pipe(input);
  }
}
