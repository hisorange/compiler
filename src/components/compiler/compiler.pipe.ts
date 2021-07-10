import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { Events } from '../event-handler/events';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { Timings } from '../event-handler/timings';
import { CompilerException } from '../exceptions/compiler.exception';
import { IFileSystem } from '../file-system';
import { ISymbol } from '../iml/interfaces/symbol.interface';
import { Logger } from '../logger';
import { ILogger } from '../logger/interfaces/logger.interface';
import { IBackendMeta } from '../module-handler/decorators/backend.decorator';
import { IBackend } from '../module-handler/interfaces/backend.interface';
import { IKernelModuleManager } from '../module-handler/interfaces/kernel-module-manager.interface';
import { IModule } from '../module-handler/interfaces/module.interface';
import { ModuleType } from '../module-handler/module-type.enum';
import { IPipe } from '../pipes/interfaces/pipe.interface';
import { IRenderer } from '../renderer';
import { ICompilerInput } from './compiler-input.interface';

type IBackendModule = IModule<IBackendMeta, IBackend>;

export class CompilerPipe
  implements IPipe<ICompilerInput, Promise<IFileSystem>>
{
  public constructor(
    @Logger('CompilerPipe') protected readonly logger: ILogger,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly eventEmitter: IEventEmitter,
    @Inject(Bindings.Provider.OutputFileSystem)
    protected readonly output: IFileSystem,
    @Inject(Bindings.Module.Handler)
    protected readonly module: IKernelModuleManager,
    @Inject(Bindings.Components.Renderer)
    protected readonly renderer: IRenderer,
  ) {}

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
