import { Bindings } from '../container/bindings';
import { Container } from '../container/container';
import { Inject } from '../container/decorators/inject.decorator';
import { Events } from '../event-handler/events';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { Timings } from '../event-handler/timings';
import { ParserException } from '../exceptions';
import { Grammar } from '../iml/grammar';
import { IGrammar } from '../iml/interfaces/grammar.interface';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { ICharacter } from '../models/interfaces/character.interface';
import { ICollection } from '../models/interfaces/collection.interface';
import { IToken } from '../models/interfaces/token.interface';
import { IModuleHandler } from '../module-handler/interfaces/module-handler.interface';
import { ModuleType } from '../module-handler/module-type.enum';
import { IPipe } from '../pipes/interfaces/pipe.interface';
import { IParserExceptionContext } from './interfaces/parser.exception-context';

export class ParserPipe implements IPipe<ICollection<ICharacter>, Promise<IToken>> {
  protected readonly logger: ILogger;

  public constructor(
    @Inject(Bindings.Factory.Logger) protected loggerFactory: LoggerFactory,
    @Inject(Bindings.Module.Handler) protected module: IModuleHandler,
    @Inject(Bindings.Container) protected container: Container,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly events: IEventEmitter,
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  async pipe(characters: ICollection<ICharacter>): Promise<IToken> {
    const extension = characters.current.path.extension;
    const grammar = this.loadGrammar(extension);

    this.logger.time(Timings.PARSING);

    if (!grammar) {
      throw new ParserException('Extension does not have a parser', {
        extension,
      });
    }

    const result = grammar.parse(characters.clone());

    this.logger.timeEnd(Timings.PARSING);

    if (!result.token || result.characters.isValid) {
      throw new ParserException<IParserExceptionContext>('Unexpected character', {
        grammar: grammar,
        characters: result.characters,
      });
    }

    // Publish the result, here the subscribers can even optimize or change the tokens.
    this.events.publish(Events.PARSED, result.token);

    return result.token;
  }

  protected loadGrammar(extension: string): IGrammar {
    let grammar: IGrammar;

    const frontends = this.module.search(ModuleType.FRONTEND);

    for (const frontendMod of frontends) {
      for (const ext of frontendMod.meta.extensions) {
        if (ext.toLowerCase() === extension.toLowerCase()) {
          const tknCls = frontendMod.meta.tokenizer;
          const tokenizer = new tknCls(this.loggerFactory);

          grammar = new Grammar(frontendMod.meta.name, tokenizer);

          if (frontendMod.meta.lexers) {
            this.container.getSync(Bindings.Collection.Lexer).push(...frontendMod.meta.lexers.map(l => new l()));
            this.container
              .getSync(Bindings.Collection.Interpreter)
              .push(...frontendMod.meta.interpreters.map(i => new i()));
          }
        }
      }
    }

    return grammar;
  }
}
