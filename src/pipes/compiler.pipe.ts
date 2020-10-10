import { IFileSystem } from '@artgen/file-system';
import { Bindings } from '../constants/bindings';
import { Events } from '../constants/events';
import { Timings } from '../constants/timings';
import { Inject } from '../decorators/inject.decorator';
import { LoggerFactory } from '../factories/logger.factory';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { ISymbol } from '../interfaces/dtos/symbol.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';
import { IRenderer } from '../interfaces/pipes/renderer.interface';

export class CompilerPipe implements IPipe<ISymbol, Promise<IFileSystem>> {
  protected readonly logger: ILogger;

  public constructor(
    @Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly eventEmitter: IEventEmitter,
    @Inject(Bindings.Collection.Renderer)
    protected readonly renderers: IRenderer[],
    @Inject(Bindings.Provider.OutputFileSystem)
    protected readonly output: IFileSystem,
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  public async pipe(symbol: ISymbol): Promise<IFileSystem> {
    this.logger.time(Timings.COMPILING);

    this.logger.info('Compiling from the ROOT symbol');
    this.traverse(symbol);
    this.eventEmitter.publish(Events.COMPILED);

    this.logger.timeEnd(Timings.COMPILING);

    return this.output;
  }

  protected traverse(symbol: ISymbol) {
    const renderers = this.renderers.filter(c =>
      c.interest.find(interest => symbol instanceof interest),
    );

    for (const renderer of renderers) {
      const symbolData = symbol.getData(renderer.dataProviders);

      renderer.render(symbol, symbolData);
    }

    for (const child of symbol.getChildren()) {
      this.traverse(child);
    }
  }
}
