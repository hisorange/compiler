import { BindingScope, Provider } from '@loopback/context';
import {
  AMLFrontend,
  BackendGenerator,
  GrammarBackend,
  NestJSBackend,
  NestJSCrudGenerator,
  TemplateGenerator,
  WSNFrontend,
} from '../../builtins';
import { CompilerPipe } from '../compiler/compiler.pipe';
import { EventEmitter } from '../event-handler/event-emitter';
import { FileSystemFactory } from '../file-system/file-system.factory';
import { FileSystemProvider } from '../file-system/file-system.provider';
import { GeneratorPipe } from '../generator/generator.pipe';
import { GeneratorPipeline } from '../generator/generator.pipeline';
import { SymbolTable } from '../iml/symbol-table';
import { LoggerFactory } from '../logger/logger.factory';
import { LoggerProvider } from '../logger/logger.provider';
import { ModuleType } from '../module-handler';
import { ModuleHandler } from '../module-handler/module-handler';
import { ParserPipe } from '../parser/parser.pipe';
import { CompilerPipeline } from '../pipelines/compiler.pipeline';
import { InterpreterPipe } from '../pipes/interpreter.pipe';
import { LexerPipe } from '../pipes/lexer.pipe';
import { ReaderPipe } from '../reader/reader.pipe';
import { Renderer } from '../renderer';
import { Bindings } from './bindings';
import { Container } from './container';
import sessionGenerator = require('uuid');

/**
 * Bootstraps a dependency injection container, this will be
 * used by the Artgen main instance to share dependencies
 * between components and plugins.
 */
export class ContainerProvider implements Provider<Container> {
  /**
   * Create a new container and bind the required dependencies to it.
   *
   * @returns {Container}
   * @memberof ContainerProvider
   */
  value(): Container {
    const container = new Container('kernel');

    container.bind(Bindings.Module.Handler).toClass(ModuleHandler).inScope(BindingScope.SINGLETON);

    this.bindSelf(container);
    this.bindSession(container);
    this.bindCollections(container);
    this.bindProviders(container);
    this.bindFactories(container);
    this.bindPipes(container);
    this.bindPipelines(container);
    this.bindComponents(container);

    this.bindBuiltIns(container);

    return container;
  }

  /**
   * Bind itself to be able to inject the container into dependencies.
   *
   * @protected
   * @param {Container} container
   * @memberof ContainerProvider
   */
  protected bindSelf(container: Container): void {
    container.bind(Bindings.Container).to(container);
  }

  /**
   * Session identified ensures an 8 byte long random hexadecimal
   * string, which starts with the letter "a", this is to ensure
   * the usability in languages where the variables has to start
   * with letters.
   *
   * The session i.d. is used to identify the compiler's execution
   * appers in the logs and can be accessed by plugins, or
   * other debug tools.
   *
   * @example "a154eb57", "a3e1e155b"
   *
   * @protected
   * @param {Container} container
   * @memberof ContainerProvider
   */
  protected bindSession(container: Container): void {
    const namespace = Bindings.Session;

    container.bind(namespace).to('a' + sessionGenerator.v4().substr(0, 7));
  }

  /**
   * Register empty collections to create the shared object.
   *
   * @protected
   * @param {Container} container
   * @memberof ContainerProvider
   */
  protected bindCollections(container: Container): void {
    const namespace = Bindings.Collection;

    container.bind(namespace.Grammar).to([]);
    container.bind(namespace.Lexer).to([]);
    container.bind(namespace.Interpreter).to([]);
    container.bind(namespace.Renderer).to([]);
  }

  /**
   * Create the provider pattern based dependencies.
   *
   * Providers are expected to share the instance
   * in their context.
   *
   * @protected
   * @param {Container} container
   * @memberof ContainerProvider
   */
  protected bindProviders(container: Container): void {
    const namespace = Bindings.Provider;

    container.bind(namespace.Logger).toProvider(LoggerProvider).inScope(BindingScope.CONTEXT);
    container.bind(namespace.InputFileSystem).toProvider(FileSystemProvider).inScope(BindingScope.CONTEXT);
    container.bind(namespace.OutputFileSystem).toProvider(FileSystemProvider).inScope(BindingScope.CONTEXT);
  }

  /**
   * Register the factory pattern based dependencies.
   *
   * @protected
   * @param {Container} container
   * @memberof ContainerProvider
   */
  protected bindFactories(container: Container): void {
    const namespace = Bindings.Factory;

    container.bind(namespace.Logger).toClass(LoggerFactory);
    container.bind(namespace.FileSystem).toClass(FileSystemFactory);
  }

  /**
   * Register the processing pipes.
   *
   * @protected
   * @param {Container} container
   * @memberof ContainerProvider
   */
  protected bindPipes(container: Container): void {
    const namespace = Bindings.Pipe;

    container.bind(namespace.Generator).toClass(GeneratorPipe);
    container.bind(namespace.Reader).toClass(ReaderPipe);
    container.bind(namespace.Parser).toClass(ParserPipe);
    container.bind(namespace.Lexer).toClass(LexerPipe);
    container.bind(namespace.Interpreter).toClass(InterpreterPipe);
    container.bind(namespace.Compiler).toClass(CompilerPipe);
  }

  /**
   * Register the processing pipelines.
   *
   * @protected
   * @param {Container} container
   * @memberof ContainerProvider
   */
  protected bindPipelines(container: Container): void {
    const namespace = Bindings.Pipeline;

    container.bind(namespace.Generator).toClass(GeneratorPipeline);
    container.bind(namespace.Compiler).toClass(CompilerPipeline);
  }

  /**
   * Register the components.
   *
   * Components are expected to share the instance in their context.
   *
   * @protected
   * @param {Container} container
   * @memberof ContainerProvider
   */
  protected bindComponents(container: Container): void {
    const namespace = Bindings.Components;

    container.bind(namespace.EventEmitter).toClass(EventEmitter).inScope(BindingScope.CONTEXT);
    container.bind(namespace.SymbolTable).toClass(SymbolTable).inScope(BindingScope.CONTEXT);
    container.bind(namespace.Renderer).toClass(Renderer);
  }

  protected bindBuiltIns(container: Container) {
    // Frontends
    container.getSync(Bindings.Module.Handler).register(ModuleType.FRONTEND, AMLFrontend);
    container.getSync(Bindings.Module.Handler).register(ModuleType.FRONTEND, WSNFrontend);

    // Backends
    container.getSync(Bindings.Module.Handler).register(ModuleType.BACKEND, GrammarBackend);
    container.getSync(Bindings.Module.Handler).register(ModuleType.BACKEND, NestJSBackend);

    // Generators
    container.getSync(Bindings.Module.Handler).register(ModuleType.GENERATOR, TemplateGenerator);
    container.getSync(Bindings.Module.Handler).register(ModuleType.GENERATOR, BackendGenerator);
    container.getSync(Bindings.Module.Handler).register(ModuleType.GENERATOR, NestJSCrudGenerator);
  }
}
