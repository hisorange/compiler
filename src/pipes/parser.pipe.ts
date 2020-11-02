import { Bindings } from '../constants/bindings';
import { Events } from '../constants/events';
import { Timings } from '../constants/timings';
import { Container } from '../container';
import { Inject } from '../decorators/inject.decorator';
import { ParserException } from '../exceptions';
import { IParserExceptionContext } from '../exceptions/contexts/parser.exception-context';
import { LoggerFactory } from '../factories/logger.factory';
import { Grammar } from '../iml/grammar';
import { ICollection } from '../interfaces/collection.interface';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { ICharacter } from '../interfaces/dtos/character.interface';
import { IToken } from '../interfaces/dtos/token.interface';
import { IGrammar } from '../interfaces/grammar.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';
import { IModuleHandler } from '../module-handler/module-handler.interface';
import { ModuleType } from '../module-handler/module.type';

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
