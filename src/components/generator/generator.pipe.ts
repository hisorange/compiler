import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { Events } from '../event-handler/events';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { Timings } from '../event-handler/timings';
import { IFileSystem } from '../file-system';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { IModuleHandler } from '../module-handler/interfaces/module-handler.interface';
import { ModuleType } from '../module-handler/module-type.enum';
import { IPipe } from '../pipes/interfaces/pipe.interface';
import { IRenderer } from '../renderer';
import { IGeneratorJob } from './generator-job.interface';

export class GeneratorPipe implements IPipe<IGeneratorJob, Promise<IFileSystem>> {
  protected readonly logger: ILogger;

  public constructor(
    @Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly eventEmitter: IEventEmitter,
    @Inject(Bindings.Provider.OutputFileSystem)
    protected readonly output: IFileSystem,
    @Inject(Bindings.Module.Handler)
    protected readonly module: IModuleHandler,
    @Inject(Bindings.Components.Renderer)
    protected readonly renderer: IRenderer,
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  public async pipe(job: IGeneratorJob): Promise<IFileSystem> {
    this.logger.time(Timings.COMPILING);
    this.logger.info('Generating output');

    const generator = this.module.retrive(ModuleType.GENERATOR, job.reference);

    this.logger.start('Generator module invoked', {
      generator: generator.meta.name,
    });

    let input = {};

    if (job.input) {
      if (typeof job.input === 'function') {
        input = await job.input(generator.meta.input);
      } else {
        input = job.input;
      }
    }

    await generator.module.render(this.renderer, input);

    if (generator.meta.author) {
      this.logger.fav(`Thanks for ${generator.meta.author.name} for this awesome generator!`);
    }

    this.renderer.write(
      '.artgenrc',
      JSON.stringify(
        {
          mode: 'generator',
          reference: job.reference,
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
