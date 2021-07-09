import { BindingAddress, BindingScope, Context } from '@loopback/context';
import {
  BackendGenerator,
  FrontendBackend,
  HighlightBackend,
  NestJSBackend,
  NestJSCrudGenerator,
  TemplateGenerator,
  WSNFrontend,
} from '../../builtins';
import { IKernelConfig } from '../../kernel/interfaces/kernel-config.interface';
import { CompilerPipe } from '../compiler/compiler.pipe';
import { DebugHelper } from '../compiler/debug-helper';
import { EventEmitter } from '../event-handler/event-emitter';
import { FileSystemFactory } from '../file-system/file-system.factory';
import { FileSystemProvider } from '../file-system/file-system.provider';
import { GeneratorPipe } from '../generator/generator.pipe';
import { GeneratorPipeline } from '../generator/generator.pipeline';
import { SymbolTable } from '../iml/symbol-table';
import { ILogger } from '../logger';
import { LoggerFactory } from '../logger/logger.factory';
import { LoggerProvider } from '../logger/logger.provider';
import { IBackend, IFrontend, IGenerator, ModuleType } from '../module-handler';
import { ModuleHandler } from '../module-handler/module-handler';
import { ParserPipe } from '../parser/parser.pipe';
import { CompilerPipeline } from '../pipelines/compiler.pipeline';
import { InterpreterPipe } from '../pipes/interpreter.pipe';
import { LexerPipe } from '../pipes/lexer.pipe';
import { ReaderPipe } from '../reader/reader.pipe';
import { Renderer } from '../renderer';
import { Bindings } from './bindings';
import { KernelException } from './exceptions';
import { Constructor, MissingBindingExceptionContext } from './interfaces';
import sessionGenerator = require('uuid');

export class Container extends Context {
  protected logger: ILogger;

  protected getLogger() {
    if (!this.logger) {
      this.logger = super.getSync(Bindings.Factory.Logger).create({
        label: 'Container',
      });
    }

    return this.logger;
  }

  getSync<T>(key: BindingAddress<T>): T {
    if (super.contains(key)) {
      this.getLogger().debug('Resolving binding', {
        key: key.toString(),
      });

      return super.getSync(key);
    }

    throw new KernelException<MissingBindingExceptionContext>(
      'Missing binding',
      {
        binding: key.toString(),
      },
    );
  }

  /**
   * Create a new container and bind the required dependencies to it.
   */
  prepareKernelBindings(kernelConfig: IKernelConfig): void {
    this.bindSelf();
    this.bind(Bindings.Config).to(kernelConfig);

    this.bind(Bindings.Module.Handler)
      .toClass(ModuleHandler)
      .inScope(BindingScope.SINGLETON);

    this.bindSession();
    this.bindCollections();
    this.bindProviders();
    this.bindFactories();
    this.bindPipes();
    this.bindPipelines();
    this.bindComponents();
    this.bindBuiltIns();
  }

  /**
   * Bind itself to be able to inject the container into dependencies.
   */
  protected bindSelf(): void {
    this.bind(Bindings.Container).to(this);
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
   */
  protected bindSession(): void {
    const namespace = Bindings.Session;

    this.bind(namespace).to('a' + sessionGenerator.v4().substr(0, 7));
  }

  /**
   * Register empty collections to create the shared object.
   */
  protected bindCollections(): void {
    const namespace = Bindings.Collection;

    this.bind(namespace.Grammar).to([]);
    this.bind(namespace.Lexer).to([]);
    this.bind(namespace.Interpreter).to([]);
    this.bind(namespace.Renderer).to([]);
  }

  /**
   * Create the provider pattern based dependencies.
   *
   * Providers are expected to share the instance
   * in their context.
   */
  protected bindProviders(): void {
    const namespace = Bindings.Provider;

    this.bind(namespace.Logger)
      .toProvider(LoggerProvider)
      .inScope(BindingScope.SINGLETON);
    this.bind(namespace.InputFileSystem)
      .toProvider(FileSystemProvider)
      .inScope(BindingScope.SINGLETON);
    this.bind(namespace.OutputFileSystem)
      .toProvider(FileSystemProvider)
      .inScope(BindingScope.SINGLETON);
  }

  /**
   * Register the factory pattern based dependencies.
   */
  protected bindFactories(): void {
    const namespace = Bindings.Factory;

    this.bind(namespace.Logger).toClass(LoggerFactory);
    this.bind(namespace.FileSystem).toClass(FileSystemFactory);
  }

  /**
   * Register the processing pipes.
   */
  protected bindPipes(): void {
    const namespace = Bindings.Pipe;

    this.bind(namespace.Generator).toClass(GeneratorPipe);
    this.bind(namespace.Reader).toClass(ReaderPipe);
    this.bind(namespace.Parser).toClass(ParserPipe);
    this.bind(namespace.Lexer).toClass(LexerPipe);
    this.bind(namespace.Interpreter).toClass(InterpreterPipe);
    this.bind(namespace.Compiler).toClass(CompilerPipe);
  }

  /**
   * Register the processing pipelines.
   */
  protected bindPipelines(): void {
    const namespace = Bindings.Pipeline;

    this.bind(namespace.Generator).toClass(GeneratorPipeline);
    this.bind(namespace.Compiler).toClass(CompilerPipeline);
  }

  /**
   * Register the components.
   *
   * Components are expected to share the instance in their context.
   */
  protected bindComponents(): void {
    const namespace = Bindings.Components;

    this.bind(namespace.EventEmitter)
      .toClass(EventEmitter)
      .inScope(BindingScope.SINGLETON);
    this.bind(namespace.SymbolTable)
      .toClass(SymbolTable)
      .inScope(BindingScope.SINGLETON);

    this.bind(namespace.Renderer)
      .toClass(Renderer)
      .inScope(BindingScope.SINGLETON);

    this.bind(namespace.DebugHelper)
      .toClass(DebugHelper)
      .inScope(BindingScope.SINGLETON);
  }

  /**
   * Register the built in modules
   */
  protected bindBuiltIns() {
    const moduleHandler = this.getSync(Bindings.Module.Handler);

    // Built in FRONTENDS
    const frontends: Constructor<IFrontend>[] = [WSNFrontend];

    // Built in BACKENDS
    const backends: Constructor<IBackend>[] = [
      FrontendBackend,
      NestJSBackend,
      HighlightBackend,
    ];

    // Built in GENERATORS
    const generators: Constructor<IGenerator>[] = [
      TemplateGenerator,
      BackendGenerator,
      NestJSCrudGenerator,
    ];

    // Register each type of built in modules
    frontends.forEach(i => moduleHandler.register(ModuleType.FRONTEND, i));
    backends.forEach(i => moduleHandler.register(ModuleType.BACKEND, i));
    generators.forEach(i => moduleHandler.register(ModuleType.GENERATOR, i));
  }
}
