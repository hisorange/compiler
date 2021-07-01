import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { LexerException, ParserException } from '../exceptions';
import { LoggerFactory } from '../logger';
import { ILogger } from '../logger/interfaces/logger.interface';
import { ICharacter } from '../models/interfaces/character.interface';
import { ICollection } from '../models/interfaces/collection.interface';
import { GrammarToken } from '../models/token';
import { IParserManager } from './interfaces/parser-manager.interface';
import { IParser } from './interfaces/parser.interface';

export class SyntaxToken extends GrammarToken {}

export abstract class AbstractParserManager implements IParserManager {
  protected readonly logger: ILogger;
  protected readonly referenceMap = new Map<string, IParser>();
  protected lastChar: ICharacter | null = null;

  constructor(
    @Inject(Bindings.Factory.Logger)
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  abstract prepare(): void;

  lastParserCharacter(): ICharacter | null {
    return this.lastChar;
  }

  private createMatch(characters: ICharacter[], type: string) {
    if (characters.length) {
      const lastChar = characters[characters.length - 1];

      if (
        !this.lastChar ||
        lastChar.position.index > this.lastChar.position.index
      ) {
        this.lastChar = lastChar;
      }
    }

    return new SyntaxToken(characters, type);
  }

  addSyntax(reference: string, parser: IParser, channel?: string): IParser {
    if (this.referenceMap.has(reference)) {
      throw new ParserException(`Parser [${reference}] is already registered!`);
    }

    const product = (chrs: ICollection<ICharacter>) => {
      const result = parser(chrs);

      if (result.match) {
        result.match.type = reference;

        const matchLength = result.match.characters.length;

        this.logger.debug('Parsed', {
          parser: reference,
          size: matchLength,
          content:
            matchLength > 12
              ? result.match.content.substr(0, 12) + '...'
              : result.match.content,
        });
      }

      return result;
    };

    this.logger.success('Parser registered', {
      reference,
    });

    this.referenceMap.set(reference, product);

    return product;
  }

  addToken(reference: string, parser: IParser, channel?: string): IParser {
    if (this.referenceMap.has(reference)) {
      throw new ParserException(
        `Tokenizer [${reference}] is already registered!`,
      );
    }

    const product: IParser = (chrs: ICollection<ICharacter>) => {
      const result = parser(chrs);

      if (result.match) {
        result.match.type = reference;

        const matchLength = result.match.characters.length;

        this.logger.info('Token created', {
          tokenizer: reference,
          size: matchLength,
          content:
            matchLength > 12
              ? result.match.content.substr(0, 12) + '...'
              : result.match.content,
        });

        result.match = new GrammarToken(
          result.match.characters,
          reference,
          channel,
        );
      }

      return result;
    };

    this.logger.success('Tokenizer registered', {
      reference,
    });

    this.referenceMap.set(reference, product);

    return product;
  }

  optional(parser: IParser): IParser {
    return (characters: ICollection<ICharacter>) => {
      const result = parser(characters);
      return result.match ? result : { characters, optional: true };
    };
  }

  literal(literal: string): IParser {
    const length = literal.length;

    if (!length) {
      throw new ParserException('Literal parser is matching for empty!');
    }

    return (characters: ICollection<ICharacter>) => {
      let match: SyntaxToken;

      if (
        characters.isValid &&
        literal ===
          characters
            .slice(characters.cursor, length)
            .map(character => character.value)
            .join('')
      ) {
        match = this.createMatch(
          characters.slice(characters.cursor, length),
          '$LITERAL',
        );
        characters.advance(length);
      }

      return { characters, match: match };
    };
  }

  regexp(regex: RegExp): IParser {
    return (characters: ICollection<ICharacter>) => {
      let match: SyntaxToken;

      if (characters.isValid && regex.test(characters.current.value)) {
        match = this.createMatch(characters.consume(), '$REGEXP');
      }

      return { characters, match: match };
    };
  }

  repetition(parser: IParser): IParser {
    return (characters: ICollection<ICharacter>) => {
      let match: SyntaxToken;
      const children: SyntaxToken[] = [];

      while (characters.isValid) {
        const result = parser(characters.clone());

        if (result.match) {
          children.push(result.match as SyntaxToken);
          characters = result.characters;
        } else {
          break;
        }
      }

      if (children.length) {
        match = this.createMatch([], '$REPETITION');
        match.addChildren(...children);
      }

      return { characters, match: match, optional: true };
    };
  }

  or(parsers: IParser[]): IParser {
    if (parsers.length < 2) {
      throw new ParserException(
        `At least 2 parser is required for or operation`,
      );
    }

    return (characters: ICollection<ICharacter>) => {
      for (const parser of parsers) {
        const result = parser(characters.clone());

        if (result.match) {
          return result;
        }
      }

      return { characters };
    };
  }

  concat(parsers: IParser[]): IParser {
    if (parsers.length < 2) {
      throw new ParserException(
        `At least 2 parser is required for concatanation`,
      );
    }

    return (characters: ICollection<ICharacter>) => {
      let chrs: ICollection<ICharacter> = characters.clone();
      const children: SyntaxToken[] = [];

      for (const parser of parsers) {
        const result = parser(chrs.clone());

        if (result.match) {
          children.push(result.match as SyntaxToken);
          chrs = result.characters;
        } else {
          if (!result.optional) {
            return { characters };
          }
        }
      }

      const token: SyntaxToken = this.createMatch([], '$CONCAT');
      token.addChildren(...children);

      return {
        characters: chrs,
        match: token,
      };
    };
  }

  alias(identifier: string): IParser {
    return (characters: ICollection<ICharacter>) => {
      const parser = this.resolve(identifier);
      const result = parser(characters);

      if (result.match) {
        const wrapper = this.createMatch([], identifier);
        wrapper.addChildren(result.match as GrammarToken);

        return {
          characters: result.characters,
          optional: result.optional,
          match: wrapper,
        };
      }

      return result;
    };
  }

  resolve(identifier: string): IParser {
    return (characters: ICollection<ICharacter>) => {
      if (this.referenceMap.has(identifier)) {
        return this.referenceMap.get(identifier)(characters);
      } else {
        throw new LexerException(`Parser not registered!`, {
          identifier,
        });
      }
    };
  }
}
