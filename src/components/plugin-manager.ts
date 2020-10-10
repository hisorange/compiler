import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { GrammarFactory } from '../factories/grammar.factory';
import { LoggerFactory } from '../factories/logger.factory';
import { RenderEngineFactory } from '../factories/render-engine.factory';
import { ILogger } from '../interfaces/components/logger.interface';
import { IContainer } from '../interfaces/container.interface';
import { IDescriptor } from '../interfaces/descriptor.interface';
import { INode } from '../interfaces/dtos/node.interface';
import { IGrammar } from '../interfaces/grammar.interface';
import { IInterpreter } from '../interfaces/pipes/interpreter.interface';
import { ILexer } from '../interfaces/pipes/lexer.interface';
import { IRenderer } from '../interfaces/pipes/renderer.interface';
import { IPluginConfig } from '../interfaces/plugin/plugin-config.interface';
import { IPluginInvoker } from '../interfaces/plugin/plugin-invoker.interface';
import { IPluginManager } from '../interfaces/plugin/plugin-manager.interface';
import { IPlugin } from '../interfaces/plugin/plugin.interface';

export class PluginManager implements IPluginManager {
  protected readonly logger: ILogger;

  constructor(
    @Inject(Bindings.Factory.Logger)
    loggerFactory: LoggerFactory,
    @Inject(Bindings.Factory.RenderEngine)
    protected readonly rendererFactory: RenderEngineFactory,
    @Inject(Bindings.Collection.Plugin)
    protected readonly plugins: IPlugin<IPluginConfig>[],
    @Inject(Bindings.Container) protected readonly container: IContainer,

    // Collections!
    @Inject(Bindings.Collection.Descriptor)
    protected readonly descriptors: IDescriptor<INode>[],
    @Inject(Bindings.Collection.Grammar)
    protected readonly grammars: IGrammar[],
    @Inject(Bindings.Collection.Lexer)
    protected readonly lexers: ILexer[],
    @Inject(Bindings.Collection.Interpreter)
    protected readonly interpreters: IInterpreter[],
    @Inject(Bindings.Collection.Renderer)
    protected readonly renderers: IRenderer[],
    @Inject(Bindings.Factory.Grammar)
    protected readonly grammarFactory: GrammarFactory,
  ) {
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  register(plugin: IPlugin<IPluginConfig>): void {
    this.logger.debug('Registering plugin', { id: plugin.id });
    this.plugins.push(plugin);
  }

  invoke(): void {
    const collections = {
      descriptors: this.descriptors,
      grammars: this.grammars,
      lexers: this.lexers,
      interpreters: this.interpreters,
      renderers: this.renderers,
    };

    for (const plugin of this.plugins) {
      const logger = this.container.getSync(Bindings.Factory.Logger).create({
        label: [plugin.id, 'Plugin'],
      });

      const renderEngine = this.rendererFactory.create(plugin);

      const data: IPluginInvoker = {
        container: this.container,
        logger,
        renderEngine,
        collections,
        plugins: this.plugins,
        grammarFactory: this.grammarFactory,
      };

      this.logger.debug('Invoking', {
        id: plugin.id,
      });

      plugin.invoke(data);
    }
  }
}
