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
import { ExtensionExceptionContext } from './interfaces/extension.exception-context';
import { IParserExceptionContext } from './interfaces/parser.exception-context';

export class ParserPipe
  implements IPipe<ICollection<ICharacter>, Promise<IToken>>
{
  protected readonly logger: ILogger;

  public constructor(
    @Inject(Bindings.Factory.Logger)
    protected readonly loggerFactory: LoggerFactory,
    @Inject(Bindings.Module.Handler) protected readonly module: IModuleHandler,
    @Inject(Bindings.Container) protected readonly container: Container,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly event: IEventEmitter,
  ) {
    this.logger = loggerFactory.create({ label: 'Parser' });
  }

  async pipe(characters: ICollection<ICharacter>): Promise<IToken> {
    this.logger.time(Timings.PARSING);

    const extension = characters.current.path.extension;

    this.logger.info('Extracted extension from path', { extension });

    const grammar = this.loadGrammar(extension);

    if (!grammar) {
      throw new ParserException<ExtensionExceptionContext>(
        'No frontend for given extension',
        { extension },
      );
    }

    // TODO: Get the Tokenizer, load the parsers and then run for the longest, then run again until the content is finished or no change is detected
    // by this, we can detect if the result is partial finished.
    // Grammar should be a helper class to handle the frontend, without collections like lexer?
    const result = grammar.parse(characters);

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
    this.event.publish(Events.PARSED, result.token);
    this.logger.timeEnd(Timings.PARSING);

    return result.token;
  }

  protected loadGrammar(extension: string): IGrammar {
    this.logger.info('Searching for frontend based on the extension');

    let grammar: IGrammar;

    this.logger.info('Loading frontends...');
    const frontends = this.module.search(ModuleType.FRONTEND);

    for (const frontendMod of frontends) {
      this.logger.debug('Testing frontend for extension', {
        frontend: frontendMod.meta.reference,
        accepts: frontendMod.meta.extensions,
      });

      for (const ext of frontendMod.meta.extensions) {
        if (ext.toLowerCase() === extension.toLowerCase()) {
          this.logger.info('Found handler', {
            frontend: frontendMod.meta.reference,
          });

          this.event.publish(Events.EXTENSION_MATCHED, ext);

          // Initialize the frontend module.
          this.logger.info('Calling initialization on the frontend');
          frontendMod.module.onInit();

          this.logger.info('Initializing the tokenizer');
          const tknCls = frontendMod.meta.tokenizer;
          const tokenizer = new tknCls(this.loggerFactory);

          grammar = new Grammar(frontendMod.meta.name, tokenizer);
          this.logger.success('Grammar is ready for parsing');

          // Load the parsers.
          this.logger.info('Preparing parsers');
          grammar.tokenizer.prepare();
          this.logger.info('Parsers are ready');

          this.logger.info('Checking for lexers');
          // Load the lexers.
          if (frontendMod.meta.lexers && frontendMod.meta.lexers.length) {
            this.logger.info('Found lexers, registering into the container');

            const lexers = this.container.getSync(Bindings.Collection.Lexer);

            for (const l of frontendMod.meta.lexers) {
              this.logger.debug('Registering lexer', {
                lexer: l.constructor.name,
              });

              lexers.push(new l());
            }

            this.logger.info('Lexers registered');
          }

          this.logger.info('Checking for interpreters');

          // Load the lexers.
          if (
            frontendMod.meta.interpreters &&
            frontendMod.meta.interpreters.length
          ) {
            this.logger.info(
              'Found interpreters, registering into the container',
            );

            const interpreters = this.container.getSync(
              Bindings.Collection.Interpreter,
            );

            for (const i of frontendMod.meta.interpreters) {
              this.logger.debug('Registering interpreter', {
                ip: i.constructor.name,
              });

              interpreters.push(new i());
            }

            this.logger.info('Interpreters registered');
          }
        }
      }
    }

    return grammar;
  }
}
