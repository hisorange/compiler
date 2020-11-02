import { IFileSystem } from '@artgen/file-system';
import { IRenderer } from '@artgen/renderer';
import { Bindings } from '../constants/bindings';
import { Events } from '../constants/events';
import { Timings } from '../constants/timings';
import { IBackendMeta } from '../decorators/backend.decorator';
import { Inject } from '../decorators/inject.decorator';
import { IBackend } from '../interfaces/backend.interface';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { ISymbol } from '../interfaces/dtos/symbol.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { IModuleHandler } from '../module-handler/module-handler.interface';
import { IModule } from '../module-handler/module.interface';
import { ModuleType } from '../module-handler/module.type';

type IBackendModule = IModule<IBackendMeta, IBackend>;

export class CompilerPipe implements IPipe<ISymbol, Promise<IFileSystem>> {
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

  public async pipe(symbol: ISymbol): Promise<IFileSystem> {
    this.logger.time(Timings.COMPILING);
    this.logger.info('Compiling from the root symbol');

    this.traverse(symbol, this.module.search(ModuleType.BACKEND));

    this.eventEmitter.publish(Events.COMPILED, symbol);
    this.logger.timeEnd(Timings.COMPILING);

    return this.output;
  }

  protected traverse(symbol: ISymbol, backends: IBackendModule[]) {
    for (const module of backends) {
      if (module.meta.interest(symbol)) {
        module.module.render(this.renderer, symbol);
      }
    }

    for (const child of symbol.getChildren()) {
      this.traverse(child, backends);
    }
  }
}
