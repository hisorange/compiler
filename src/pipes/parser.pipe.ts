import { Bindings } from '../constants/bindings';
import { Events } from '../constants/events';
import { Timings } from '../constants/timings';
import { Inject } from '../decorators/inject.decorator';
import { ParserException } from '../exceptions';
import { IParserExceptionContext } from '../exceptions/contexts/parser.exception-context';
import { LoggerFactory } from '../factories/logger.factory';
import { ICollection } from '../interfaces/collection.interface';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { ICharacter } from '../interfaces/dtos/character.interface';
import { IToken } from '../interfaces/dtos/token.interface';
import { IGrammar } from '../interfaces/grammar.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';

export class ParserPipe
  implements IPipe<ICollection<ICharacter>, Promise<IToken>> {
  protected readonly logger: ILogger;

  public constructor(
    @Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly events: IEventEmitter,
    @Inject(Bindings.Collection.Grammar)
    protected readonly grammars: IGrammar[],
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  async pipe(characters: ICollection<ICharacter>): Promise<IToken> {
    this.logger.time(Timings.PARSING);

    const extension = characters.current.path.extension;
    const grammar: IGrammar = this.grammars.find(
      g => g.extension === extension,
    );

    if (!grammar) {
      throw new ParserException('Extension does not have a parser', {
        extension,
      });
    }

    const result = grammar.parse(characters.clone());

    this.logger.timeEnd(Timings.PARSING);

    if (!result.token || result.characters.isValid) {
      throw new ParserException<IParserExceptionContext>(
        'Unexpected character',
        {
          grammar: grammar,
          characters: result.characters,
        },
      );
    }

    // Publish the result, here the subscribers can even optimize or change the tokens.
    this.events.publish(Events.PARSED, result.token);

    return result.token;
  }
}
