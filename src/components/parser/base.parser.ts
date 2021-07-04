import { Bindings, Container, Inject } from '../container';
import { ParserException } from '../exceptions';
import { ILogger, LoggerFactory } from '../logger';
import { ICharacter, ICollection, Node } from '../models';
import { Channel } from './channel';
import { IFragmentParserResult } from './interfaces/fragment-parser-result.interface';
import { IFragmentParser } from './interfaces/fragment-parser.interface';

export abstract class BaseParser {
  protected readonly logger: ILogger;

  constructor(
    @Inject(Bindings.Container)
    protected readonly ctx: Container,
    @Inject(Bindings.Factory.Logger)
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create({
      label: 'GrammarParser',
    });
  }

  abstract getContextPrefix(): string;
  abstract register(): void;

  registerChannel(name: string) {
    const keyPrefix = 'grammar.' + this.getContextPrefix() + '.channel';
    const key = keyPrefix + '.' + name.toLowerCase();

    this.ctx.bind(key).to(new Channel(name)).tag(keyPrefix);
    this.logger.info('Channel registered', { name, key });
  }

  registerParser(ref: string, parser: IFragmentParser): void {
    const keyPrefix = 'grammar.' + this.getContextPrefix() + '.parser';
    const key = keyPrefix + '.' + ref.toLowerCase();

    this.ctx.bind(key).to(parser).tag(keyPrefix);
    this.logger.info('Parser registered', { ref, key });
  }

  protected resolveParser(ref: string): IFragmentParser {
    const keyPrefix = 'grammar.' + this.getContextPrefix() + '.parser';
    const key = keyPrefix + '.' + ref.toLowerCase();

    if (this.ctx.contains(key)) {
      const parser = this.ctx.getSync<IFragmentParser>(key);
      this.logger.debug('Parser loaded', { ref, key });

      return parser;
    } else {
      throw new ParserException('Parser reference is not registered!', {
        ref,
      });
    }
  }

  parseLiteral(ref: string, channel: string, literal: string): IFragmentParser {
    const literalLength = literal.length;

    return (characters: ICollection<ICharacter>): IFragmentParserResult => {
      const slice = characters.slice(characters.cursor, literalLength);
      const asString = slice.map(c => c.value).join('');

      if (literal === asString) {
        const node = new Node(ref, channel, characters.current.value);

        characters.consume(literalLength);

        return {
          node,
          characters,
        };
      }

      return false;
    };
  }

  parseLogicOr(options: IFragmentParser[]): IFragmentParser {
    return (characters: ICollection<ICharacter>): IFragmentParserResult => {
      for (const parser of options) {
        const result = parser(characters);

        if (result) {
          return result;
        }
      }

      return false;
    };
  }

  nestParser(ref: string): IFragmentParser {
    return (characters: ICollection<ICharacter>): IFragmentParserResult =>
      this.resolveParser(ref)(characters);
  }

  wrapParser(
    ref: string,
    channel: string,
    parser: IFragmentParser,
  ): IFragmentParser {
    return (characters: ICollection<ICharacter>): IFragmentParserResult => {
      const result = parser(characters);

      if (result) {
        const node = new Node(ref, channel);
        node.addChildren(result.node as Node);
      }

      return result;
    };
  }
}
