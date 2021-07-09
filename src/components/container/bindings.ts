import { BindingKey } from '@loopback/context';
import { IKernel } from '../../kernel';
import { IKernelConfig } from '../../kernel/interfaces/kernel-config.interface';
import { CompilerPipe } from '../compiler/compiler.pipe';
import { DebugHelper } from '../compiler/debug-helper';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { IFileSystem } from '../file-system';
import { FileSystemFactory } from '../file-system/file-system.factory';
import { GeneratorPipe } from '../generator/generator.pipe';
import { GeneratorPipeline } from '../generator/generator.pipeline';
import { IGrammar } from '../iml/interfaces/grammar.interface';
import { ISymbolTable } from '../iml/interfaces/symbol-table.interface';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { IKernelModuleManager } from '../module-handler/interfaces/kernel-module-manager.interface';
import { ParserPipe } from '../parser/parser.pipe';
import { CompilerPipeline } from '../pipelines/compiler.pipeline';
import { IInterpreter } from '../pipes/interfaces/interpreter.interface';
import { ILexer } from '../pipes/interfaces/lexer.interface';
import { InterpreterPipe } from '../pipes/interpreter.pipe';
import { LexerPipe } from '../pipes/lexer.pipe';
import { ReaderPipe } from '../reader/reader.pipe';
import { IRenderer } from '../renderer';
import { Container } from './container';

export const Bindings = {
  Kernel: BindingKey.create<IKernel>('Kernel'),
  Config: BindingKey.create<IKernelConfig>('Config'),
  Container: BindingKey.create<Container>('Container'),

  Session: BindingKey.create<string>('Session'),
  Module: {
    Handler: BindingKey.create<IKernelModuleManager>('Module.Handler'),
  },
  Components: {
    EventEmitter: BindingKey.create<IEventEmitter>('EventEmitter'),
    SymbolTable: BindingKey.create<ISymbolTable>('SymbolTable'),
    Renderer: BindingKey.create<IRenderer>('Renderer'),
    DebugHelper: BindingKey.create<DebugHelper>('DebugHelper'),
  },
  Provider: {
    Logger: BindingKey.create<ILogger>('Provider.Logger'),
    InputFileSystem: BindingKey.create<IFileSystem>('Provider.InputFileSystem'),
    OutputFileSystem: BindingKey.create<IFileSystem>(
      'Provider.OutputFileSystem',
    ),
  },
  Factory: {
    FileSystem: BindingKey.create<FileSystemFactory>('Factory.FileSystem'),
    Logger: BindingKey.create<LoggerFactory>('Factory.Logger'),
  },
  Pipe: {
    Generator: BindingKey.create<GeneratorPipe>('Pipe.Generator'),
    Reader: BindingKey.create<ReaderPipe>('Pipe.Reader'),
    Parser: BindingKey.create<ParserPipe>('Pipe.Parser'),
    Lexer: BindingKey.create<LexerPipe>('Pipe.Lexer'),
    Interpreter: BindingKey.create<InterpreterPipe>('Pipe.Interpreter'),
    Compiler: BindingKey.create<CompilerPipe>('Pipe.Compiler'),
  },
  Pipeline: {
    Generator: BindingKey.create<GeneratorPipeline>('Pipeline.Generator'),
    Compiler: BindingKey.create<CompilerPipeline>('Pipeline.Compiler'),
  },
  Collection: {
    Grammar: BindingKey.create<IGrammar[]>('Collection.Grammar'),
    Lexer: BindingKey.create<ILexer[]>('Collection.Lexer'),
    Interpreter: BindingKey.create<IInterpreter[]>('Collection.Interpreter'),
    Renderer: BindingKey.create<IRenderer[]>('Collection.Renderer'),
  },
};
