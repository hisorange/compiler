import { Bindings } from '../container/bindings';
import { Container } from '../container/container';
import { Inject } from '../container/decorators';
import { ParserException } from '../exceptions';
import { ILogger, LoggerFactory } from '../logger';
import { ICharacter, ICollection, Node } from '../models';
import { Channel } from './channel';
import { IFragmentParserResult } from './interfaces/fragment-parser-result.interface';
import { IFragmentParserSchema } from './interfaces/fragment-parser-schema.interface';
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

  registerParser(schema: IFragmentParserSchema): void {
    for (const ref of schema.references) {
      const keyPrefix = 'grammar.' + this.getContextPrefix() + '.parser';
      const key = keyPrefix + '.' + ref.toLowerCase();

      this.ctx.bind(key).to(schema.matcher).tag(keyPrefix);
      this.logger.info('Parser registered', { ref, key });
    }
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

  parseLiteral(literal: string): IFragmentParser {
    const literalLength = literal.length;

    return (characters: ICollection<ICharacter>): IFragmentParserResult => {
      const slice = characters.slice(characters.cursor, literalLength);
      const asString = slice.map(c => c.value).join('');

      if (literal === asString) {
        const node = new Node('Literal', 'Main', characters.current.value);

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
          const node = new Node('OrGroup', 'Main');
          node.addChildren(result.node as Node);

          return {
            characters: result.characters,
            node: node,
          };
        }
      }

      return false;
    };
  }

  parseLogicAnd(sequence: IFragmentParser[]): IFragmentParser {
    return (characters: ICollection<ICharacter>): IFragmentParserResult => {
      const node = new Node('AndGroup', 'Main');
      const from = characters.cursor;

      for (const parser of sequence) {
        const result = parser(characters);

        if (!result) {
          // Revert the cursor to the starting point.
          characters.advance(from - characters.cursor);

          return false;
        } else {
          node.addChildren(result.node as Node);
        }
      }

      return false;
    };
  }

  parseRange(
    ref: string,
    channel: string,
    from: string,
    to: string,
  ): IFragmentParser {
    let range_pointer = from.charCodeAt(0);
    const range_end = to.charCodeAt(0);
    const orGroup = [];

    if (range_pointer > range_end) {
      throw new ParserException('Invalid parser range', {
        ref,
        from,
        to,
      });
    }

    while (range_pointer <= range_end) {
      orGroup.push(this.parseLiteral(String.fromCharCode(range_pointer)));

      range_pointer++;
    }

    const parser = this.parseLogicOr(orGroup);

    return parser;
  }

  parseRepetitionNoneOrMore(
    ref: string,
    channel: string,
    parser: IFragmentParser,
  ): IFragmentParser {
    return (characters: ICollection<ICharacter>): IFragmentParserResult => {
      const node = new Node(ref, channel);

      while (characters.isValid) {
        const result = parser(characters);

        if (result) {
          node.addChildren(result.node as Node);
          characters = result.characters;
        } else {
          break;
        }
      }

      return {
        characters,
        node: node,
      };
    };
  }

  parseRepetitionOneOrMore(
    ref: string,
    channel: string,
    parser: IFragmentParser,
  ): IFragmentParser {
    return (characters: ICollection<ICharacter>): IFragmentParserResult => {
      const node = new Node(ref, channel);

      while (characters.isValid) {
        const result = parser(characters);

        if (result) {
          node.addChildren(result.node as Node);
          characters = result.characters;
        } else {
          break;
        }
      }

      if (node.getChildren().length) {
        return {
          characters,
          node: node,
        };
      } else {
        return false;
      }
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

  invertParser(
    ref: string,
    channel: string,
    parser: IFragmentParser,
  ): IFragmentParser {
    return (characters: ICollection<ICharacter>): IFragmentParserResult => {
      const from = characters.cursor;

      const result = parser(characters);

      if (result) {
        if (characters.cursor !== from) {
          // Revert to the start point.
          characters.advance(from - characters.cursor);

          return false;
        }
      }

      const node = new Node(ref, channel, characters.consume(1)[0].value);

      return { characters, node };
    };
  }
}
