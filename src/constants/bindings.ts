import { IFileSystem } from '@artgen/file-system';
import { IRenderEngine } from '@artgen/renderer';
import { BindingKey } from '@loopback/context';
import { FileSystemFactory } from '../factories/file-system.factory';
import { LoggerFactory } from '../factories/logger.factory';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { IConfig } from '../interfaces/config.interface';
import { IContainer } from '../interfaces/container.interface';
import { IGrammar } from '../interfaces/grammar.interface';
import { IInterpreter } from '../interfaces/pipes/interpreter.interface';
import { ILexer } from '../interfaces/pipes/lexer.interface';
import { IRenderer } from '../interfaces/pipes/renderer.interface';
import { ISymbolTable } from '../interfaces/symbol-table.interface';
import { CompilerPipeline } from '../pipelines/compiler.pipeline';
import { GeneratorPipeline } from '../pipelines/generator.pipeline';
import { CompilerPipe } from '../pipes/compiler.pipe';
import { GeneratorPipe } from '../pipes/generator.pipe';
import { InterpreterPipe } from '../pipes/interpreter.pipe';
import { LexerPipe } from '../pipes/lexer.pipe';
import { ParserPipe } from '../pipes/parser.pipe';
import { ReaderPipe } from '../pipes/reader.pipe';

export const Bindings = {
  Config: BindingKey.create<IConfig>('Config'),
  Session: BindingKey.create<string>('Session'),
  Container: BindingKey.create<IContainer>('Container'),
  Components: {
    EventEmitter: BindingKey.create<IEventEmitter>('EventEmitter'),
    SymbolTable: BindingKey.create<ISymbolTable>('SymbolTable'),
    RenderEngine: BindingKey.create<IRenderEngine>('RenderEngine'),
  },
  Provider: {
    Logger: BindingKey.create<ILogger>('Provider.Logger'),
    InputFileSystem: BindingKey.create<IFileSystem>('Provider.InputFileSystem'),
    OutputFileSystem: BindingKey.create<IFileSystem>('Provider.OutputFileSystem'),
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
