import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { Events } from '../event-handler/events';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { Timings } from '../event-handler/timings';
import { CompilerException } from '../exceptions/compiler.exception';
import { IFileSystem } from '../file-system';
import { ISymbol } from '../iml/interfaces/symbol.interface';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { IBackendMeta } from '../module-handler/decorators/backend.decorator';
import { IBackend } from '../module-handler/interfaces/backend.interface';
import { IModuleHandler } from '../module-handler/interfaces/module-handler.interface';
import { IModule } from '../module-handler/interfaces/module.interface';
import { ModuleType } from '../module-handler/module-type.enum';
import { IPipe } from '../pipes/interfaces/pipe.interface';
import { IRenderer } from '../renderer';
import { ICompilerInput } from './compiler-input.interface';

type IBackendModule = IModule<IBackendMeta, IBackend>;

export class CompilerPipe
  implements IPipe<ICompilerInput, Promise<IFileSystem>>
{
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

  public async pipe(input: ICompilerInput): Promise<IFileSystem> {
    const symbol = input.symbol;

    this.logger.time(Timings.COMPILING);
    this.logger.info('Compiling from the root symbol');

    const backends = [];

    for (const backend of this.module.search(ModuleType.BACKEND)) {
      if (input.backendRefs.includes(backend.meta.reference)) {
        backends.push(backend);
      }
    }

    if (!backends.length) {
      throw new CompilerException('No backend loaded', {
        requested: input.backendRefs,
        available: this.module
          .search(ModuleType.BACKEND)
          .map(b => b.meta.reference),
      });
    }

    await this.traverse(symbol, backends);

    this.eventEmitter.publish(Events.COMPILED, symbol);
    this.logger.timeEnd(Timings.COMPILING);

    return this.output;
  }

  protected async traverse(symbol: ISymbol, backends: IBackendModule[]) {
    for (const module of backends) {
      if (module.meta.interest(symbol)) {
        await module.module.render(this.renderer, symbol);
      }
    }

    for (const child of symbol.getChildren()) {
      await this.traverse(child, backends);
    }
  }
}
