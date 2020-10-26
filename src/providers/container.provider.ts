import { RenderEngine } from '@artgen/renderer';
import { BindingScope, Provider } from '@loopback/context';
import { EventEmitter } from '../components/event-emitter';
import { Bindings } from '../constants/bindings';
import { Container } from '../container';
import { FileSystemFactory } from '../factories/file-system.factory';
import { LoggerFactory } from '../factories/logger.factory';
import { SymbolTable } from '../iml/symbol-table';
import { IContainer } from '../interfaces/container.interface';
import { CompilerPipe } from '../pipes/compiler.pipe';
import { GeneratorPipe } from '../pipes/generator.pipe';
import { InterpreterPipe } from '../pipes/interpreter.pipe';
import { LexerPipe } from '../pipes/lexer.pipe';
import { ParserPipe } from '../pipes/parser.pipe';
import { ReaderPipe } from '../pipes/reader.pipe';
import { LoggerProvider } from '../providers/logger.provider';
import { MemoryFileSystemProvider } from './memory-file-system.provider';
import sessionGenerator = require('uuid');

/**
 * Bootstraps a dependency injection container, this will be
 * used by the Artgen main instance to share dependencies
 * between components and plugins.
 */
export class ContainerProvider implements Provider<IContainer> {
  /**
   * Create a new container and bind the required dependencies to it.
   *
   * @returns {IContainer}
   * @memberof ContainerProvider
   */
  value(): IContainer {
    const container = new Container();

    this.bindSelf(container);
    this.bindSession(container);
    this.bindCollections(container);
    this.bindProviders(container);
    this.bindFactories(container);
    this.bindPipes(container);
    this.bindComponents(container);

    return container;
  }

  /**
   * Bind itself to be able to inject the container into dependencies.
   *
   * @protected
   * @param {IContainer} container
   * @memberof ContainerProvider
   */
  protected bindSelf(container: IContainer): void {
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
   * @param {IContainer} container
   * @memberof ContainerProvider
   */
  protected bindSession(container: IContainer): void {
    const namespace = Bindings.Session;

    container.bind(namespace).to('a' + sessionGenerator.v4().substr(0, 7));
  }

  /**
   * Register empty collections to create the shared object.
   *
   * @protected
   * @param {IContainer} container
   * @memberof ContainerProvider
   */
  protected bindCollections(container: IContainer): void {
    const namespace = Bindings.Collection;

    container.bind(namespace.Grammar).to([]);
    container.bind(namespace.Lexer).to([]);
    container.bind(namespace.Interpreter).to([]);
    container.bind(namespace.Renderer).to([]);
    container.bind(namespace.Descriptor).to([]);
  }

  /**
   * Create the provider pattern based dependencies.
   *
   * Providers are expected to share the instance
   * in their context.
   *
   * @protected
   * @param {IContainer} container
   * @memberof ContainerProvider
   */
  protected bindProviders(container: IContainer): void {
    const namespace = Bindings.Provider;

    container.bind(namespace.Logger).toProvider(LoggerProvider).inScope(BindingScope.CONTEXT);
    container.bind(namespace.InputFileSystem).toProvider(MemoryFileSystemProvider).inScope(BindingScope.CONTEXT);
    container.bind(namespace.OutputFileSystem).toProvider(MemoryFileSystemProvider).inScope(BindingScope.CONTEXT);
  }

  /**
   * Register the factory pattern based dependencies.
   *
   * @protected
   * @param {IContainer} container
   * @memberof ContainerProvider
   */
  protected bindFactories(container: IContainer): void {
    const namespace = Bindings.Factory;

    container.bind(namespace.Logger).toClass(LoggerFactory);
    container.bind(namespace.FileSystem).toClass(FileSystemFactory);
  }

  /**
   * Register the processing pipes.
   *
   * @protected
   * @param {IContainer} container
   * @memberof ContainerProvider
   */
  protected bindPipes(container: IContainer): void {
    const namespace = Bindings.Pipe;

    container.bind(namespace.Generator).toClass(GeneratorPipe);
    container.bind(namespace.Reader).toClass(ReaderPipe);
    container.bind(namespace.Parser).toClass(ParserPipe);
    container.bind(namespace.Lexer).toClass(LexerPipe);
    container.bind(namespace.Interpreter).toClass(InterpreterPipe);
    container.bind(namespace.Compiler).toClass(CompilerPipe);
  }

  /**
   * Register the components.
   *
   * Components are expected to share the instance in their context.
   *
   * @protected
   * @param {IContainer} container
   * @memberof ContainerProvider
   */
  protected bindComponents(container: IContainer): void {
    const namespace = Bindings.Components;

    container.bind(namespace.EventEmitter).toClass(EventEmitter).inScope(BindingScope.CONTEXT);
    container.bind(namespace.SymbolTable).toClass(SymbolTable).inScope(BindingScope.CONTEXT);
    container.bind(namespace.RenderEngine).toClass(RenderEngine);
  }
}
