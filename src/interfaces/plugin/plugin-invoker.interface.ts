import { GrammarFactory } from '../../factories/grammar.factory';
import { ILogger } from '../components/logger.interface';
import { IRenderEngine } from '../components/render-engine.interface';
import { IContainer } from '../container.interface';
import { IDescriptor } from '../descriptor.interface';
import { INode } from '../dtos/node.interface';
import { IGrammar } from '../grammar.interface';
import { IInterpreter } from '../pipes/interpreter.interface';
import { ILexer } from '../pipes/lexer.interface';
import { IRenderer } from '../pipes/renderer.interface';
import { IPluginConfig } from './plugin-config.interface';
import { IPlugin } from './plugin.interface';

export interface IPluginInvoker {
  /**
   * Custom logger for each plugin, setup with their own label.
   *
   * @type {ILogger}
   * @memberof IPluginInvoker
   */
  readonly logger: ILogger;

  /**
   * Custom renderer.
   *
   * @type {IRenderEngine}
   * @memberof IPluginInvoker
   */
  readonly renderEngine: IRenderEngine;

  /**
   * Dependency container for this execution context.
   *
   * @type {IContainer}
   * @memberof IPluginInvoker
   */
  readonly container: IContainer;

  readonly grammarFactory: GrammarFactory;

  /**
   * Every plugin's config passed around to allow intercommunication.
   *
   * @type {IPlugin[]}
   * @memberof IPluginInvoker
   */
  readonly plugins: IPlugin<IPluginConfig>[];

  readonly collections: {
    descriptors: IDescriptor<INode>[];
    grammars: IGrammar[];
    lexers: ILexer[];
    interpreters: IInterpreter[];
    renderers: IRenderer[];
  };
}
