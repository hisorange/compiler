import { IFileSystem } from '@artgen/file-system';
import { BindingKey } from '@loopback/context';
import { Tokenizer } from '../components/tokenizer.old';
import { FileSystemFactory } from '../factories/file-system.factory';
import { GrammarFactory } from '../factories/grammar.factory';
import { LoggerFactory } from '../factories/logger.factory';
import { RenderEngineFactory } from '../factories/render-engine.factory';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { IRenderEngine } from '../interfaces/components/render-engine.interface';
import { IConfig } from '../interfaces/config.interface';
import { IContainer } from '../interfaces/container.interface';
import { IDescriptor } from '../interfaces/descriptor.interface';
import { INode } from '../interfaces/dtos/node.interface';
import { IGrammar } from '../interfaces/grammar.interface';
import { IInterpreter } from '../interfaces/pipes/interpreter.interface';
import { ILexer } from '../interfaces/pipes/lexer.interface';
import { IRenderer } from '../interfaces/pipes/renderer.interface';
import { IPluginConfig } from '../interfaces/plugin/plugin-config.interface';
import { IPluginManager } from '../interfaces/plugin/plugin-manager.interface';
import { IPlugin } from '../interfaces/plugin/plugin.interface';
import { ISymbolTable } from '../interfaces/symbol-table.interface';
import { CompilerPipe } from '../pipes/compiler.pipe';
import { InterpreterPipe } from '../pipes/interpreter.pipe';
import { LexerPipe } from '../pipes/lexer.pipe';
import { ParserPipe } from '../pipes/parser.pipe';
import { ReaderPipe } from '../pipes/reader.pipe';

export const Bindings = {
  Config: BindingKey.create<IConfig>('Config'),
  Session: BindingKey.create<string>('Session'),
  Container: BindingKey.create<IContainer>('Container'),
  Components: {
    Tokenizer: BindingKey.create<Tokenizer>('Tokenizer'),
    EventEmitter: BindingKey.create<IEventEmitter>('EventEmitter'),
    PluginManager: BindingKey.create<IPluginManager>('PluginManager'),
    SymbolTable: BindingKey.create<ISymbolTable>('SymbolTable'),
    RenderEngine: BindingKey.create<IRenderEngine>('RenderEngine'),
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
    Grammar: BindingKey.create<GrammarFactory>('Factory.Grammar'),
    Logger: BindingKey.create<LoggerFactory>('Factory.Logger'),
    RenderEngine: BindingKey.create<RenderEngineFactory>(
      'Factory.RenderEngine',
    ),
  },
  Pipe: {
    Reader: BindingKey.create<ReaderPipe>('Pipe.Reader'),
    Parser: BindingKey.create<ParserPipe>('Pipe.Parser'),
    Lexer: BindingKey.create<LexerPipe>('Pipe.Lexer'),
    Interpreter: BindingKey.create<InterpreterPipe>('Pipe.Interpreter'),
    Compiler: BindingKey.create<CompilerPipe>('Pipe.Compiler'),
  },
  Collection: {
    Plugin: BindingKey.create<IPlugin<IPluginConfig>[]>('Collection.Plugin'),
    Grammar: BindingKey.create<IGrammar[]>('Collection.Grammar'),
    Lexer: BindingKey.create<ILexer[]>('Collection.Lexer'),
    Interpreter: BindingKey.create<IInterpreter[]>('Collection.Interpreter'),
    Renderer: BindingKey.create<IRenderer[]>('Collection.Renderer'),
    Descriptor: BindingKey.create<IDescriptor<INode>[]>(
      'Collection.Descriptor',
    ),
  },
};
