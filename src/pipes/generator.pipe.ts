import { IFileSystem } from '@artgen/file-system';
import { Bindings } from '../constants/bindings';
import { Events } from '../constants/events';
import { Timings } from '../constants/timings';
import { IGeneratorMeta } from '../decorators/generator.decorator';
import { Inject } from '../decorators/inject.decorator';
import { CompilerException } from '../exceptions/compiler.exception';
import { LoggerFactory } from '../factories/logger.factory';
import { IGenerator } from '../interfaces/backend.interface';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { IContainer } from '../interfaces/container.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';

type GetConfig = (prompt: any) => Promise<Object>;

interface IGeneratorJob {
  ref: string;
  input: Object | GetConfig;
}

export class GeneratorPipe
  implements IPipe<IGeneratorJob, Promise<IFileSystem>> {
  protected readonly logger: ILogger;

  public constructor(
    @Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly eventEmitter: IEventEmitter,
    @Inject(Bindings.Provider.OutputFileSystem)
    protected readonly output: IFileSystem,
    @Inject(Bindings.Container)
    protected readonly container: IContainer,
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  public async pipe(job: IGeneratorJob): Promise<IFileSystem> {
    this.logger.time(Timings.COMPILING);
    this.logger.info('Generating output');

    if (!this.container.contains('generator.' + job.ref)) {
      throw new CompilerException(`Generator doest not exists`, {
        reference: job.ref,
      });
    }

    const generator = this.container.getSync<IGenerator>(
      'generator.' + job.ref,
    );
    const meta = this.container.getSync<IGeneratorMeta>(
      'generator-meta.' + job.ref,
    );

    this.logger.start('Generator invoked', {
      generator: meta.name,
    });

    let input = {};

    if (job.input) {
      if (typeof job.input === 'function') {
        input = await job.input(meta.input);
      } else {
        input = job.input;
      }
    }

    const renderer = this.container.getSync(Bindings.Components.RenderEngine);

    if (meta.templates) {
      for (const c of meta.templates) {
        renderer.registerTemplate(c);
      }
    }

    await generator.render(renderer, job.input);

    if (meta.author) {
      this.logger.fav(
        `Thanks for ${meta.author.name} for this awesome generator!`,
      );
    }

    renderer.write(
      '.artgenrc',
      JSON.stringify(
        {
          mode: 'generator',
          reference: job.ref,
          input,
        },
        null,
        2,
      ),
    );

    this.eventEmitter.publish(Events.COMPILED);
    this.logger.timeEnd(Timings.COMPILING);

    return this.output;
  }
}
