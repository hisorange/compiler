import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { Events } from '../event-handler/events';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { Timings } from '../event-handler/timings';
import { IFileSystem } from '../file-system';
import { ISymbol } from '../iml/interfaces/symbol.interface';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { IBackendMeta } from '../module-handler/decorators/backend.decorator';
import { IBackend } from '../module-handler/interfaces/backend.interface';
import { IModuleHandler } from '../module-handler/interfaces/module-handler.interface';
import { IModule } from '../module-handler/interfaces/module.interface';
import { ModuleType } from '../module-handler/module-type.enum';
import { IRenderer } from '../renderer';
import { IPipe } from './interfaces/pipe.interface';

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
