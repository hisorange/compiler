import { IFileSystem } from '@artgen/file-system';
import { IRenderer } from '@artgen/renderer';
import { Bindings } from '../constants/bindings';
import { Events } from '../constants/events';
import { Timings } from '../constants/timings';
import { IBackendMeta } from '../decorators/backend.decorator';
import { Inject } from '../decorators/inject.decorator';
import { LoggerFactory } from '../factories/logger.factory';
import { IBackend } from '../interfaces/backend.interface';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { IContainer } from '../interfaces/container.interface';
import { ISymbol } from '../interfaces/dtos/symbol.interface';
import { IModuleResolution } from '../interfaces/module-resolution.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';

type IBackendModule = IModuleResolution<IBackendMeta, IBackend>;

export class CompilerPipe implements IPipe<ISymbol, Promise<IFileSystem>> {
  protected readonly logger: ILogger;

  public constructor(
    @Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly eventEmitter: IEventEmitter,
    @Inject(Bindings.Provider.OutputFileSystem)
    protected readonly output: IFileSystem,
    @Inject(Bindings.Container)
    protected readonly container: IContainer,
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

    this.traverse(symbol, this.loadBackends());

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

  protected loadBackends(): IBackendModule[] {
    const backends: IBackendModule[] = [];

    for (const backendMetaRef of this.container.findByTag('backend-meta')) {
      const meta: IBackendMeta = backendMetaRef.getValue(this.container);

      backends.push({
        meta,
        module: this.container.getSync<IBackend>(`backend.${meta.reference}`),
      });

      this.logger.info(`Loaded kernel backend module`, {
        reference: meta.reference,
      });
    }

    return backends;
  }
}
