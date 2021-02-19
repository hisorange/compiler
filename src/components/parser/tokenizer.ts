import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { LexerException, ParserException } from '../exceptions';
import { LoggerFactory } from '../logger';
import { ILogger } from '../logger/interfaces/logger.interface';
import { ICharacter } from '../models/interfaces/character.interface';
import { ICollection } from '../models/interfaces/collection.interface';
import { IToken } from '../models/interfaces/token.interface';
import { Token } from '../models/token';
import { IParser } from './interfaces/parser.interface';
import { ITokenizer } from './interfaces/tokenizer.interface';

export abstract class Tokenizer implements ITokenizer {
  protected readonly logger: ILogger;
  protected readonly symbolMap = new Map<string, IParser>();
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

  private createToken(characters: ICharacter[], type: string) {
    if (characters.length) {
      const lastChar = characters[characters.length - 1];

      if (!this.lastChar || lastChar.position.index > this.lastChar.position.index) {
        this.lastChar = lastChar;
      }
    }

    return new Token(characters, type);
  }

  identifier(reference: string, parser: IParser, channel?: string): IParser {
    if (this.symbolMap.has(reference)) {
      throw new ParserException(`Type [${reference}] is already registered!`);
    }

    const product = (chrs: ICollection<ICharacter>) => {
      const result = parser(chrs);

      if (result.token) {
        result.token.type = reference;

        const tokenLength = result.token.length;

        this.logger.info('Token created', {
          type: reference,
          size: tokenLength,
          content: tokenLength > 12 ? result.token.content.substr(0, 12) + '...' : result.token.content,
        });
      }

      return result;
    };

    this.symbolMap.set(reference, product);

    return product;
  }

  optional(parser: IParser): IParser {
    return (characters: ICollection<ICharacter>) => {
      const result = parser(characters);
      return result.token ? result : { characters, optional: true };
    };
  }

  literal(literal: string): IParser {
    const length = literal.length;

    if (!length) {
      throw new ParserException('Literal parser is matching for empty!');
    }

    return (characters: ICollection<ICharacter>) => {
      let token: IToken;

      if (
        characters.isValid &&
        literal ===
          characters
            .slice(characters.cursor, length)
            .map(character => character.value)
            .join('')
      ) {
        token = this.createToken(characters.slice(characters.cursor, length), '$LITERAL');
        characters.advance(length);
      }

      return { characters, token };
    };
  }

  regexp(regex: RegExp): IParser {
    return (characters: ICollection<ICharacter>) => {
      let token: IToken;

      if (characters.isValid && regex.test(characters.current.value)) {
        token = this.createToken(characters.consume(), '$REGEXP');
      }

      return { characters, token };
    };
  }

  repetition(parser: IParser): IParser {
    return (characters: ICollection<ICharacter>) => {
      let token: IToken;
      const children: IToken[] = [];

      while (characters.isValid) {
        const result = parser(characters.clone());

        if (result.token) {
          children.push(result.token);
          characters = result.characters;
        } else {
          break;
        }
      }

      if (children.length) {
        token = this.createToken([], '$REPETITION');
        token.addChildren(...children);
      }

      return { characters, token, optional: true };
    };
  }

  or(parsers: IParser[]): IParser {
    if (parsers.length < 2) {
      throw new ParserException(`At least 2 parser is required for or operation`);
    }

    return (characters: ICollection<ICharacter>) => {
      for (const parser of parsers) {
        const result = parser(characters.clone());

        if (result.token) {
          return result;
        }
      }

      return { characters };
    };
  }

  concat(parsers: IParser[]): IParser {
    if (parsers.length < 2) {
      throw new ParserException(`At least 2 parser is required for concatanation`);
    }

    return (characters: ICollection<ICharacter>) => {
      let chrs: ICollection<ICharacter> = characters.clone();
      const children: IToken[] = [];

      for (const parser of parsers) {
        const result = parser(chrs.clone());

        if (result.token) {
          children.push(result.token);
          chrs = result.characters;
        } else {
          if (!result.optional) {
            return { characters };
          }
        }
      }

      const token: IToken = this.createToken([], '$CONCAT');
      token.addChildren(...children);

      return {
        characters: chrs,
        token,
      };
    };
  }

  alias(identifier: string): IParser {
    return (characters: ICollection<ICharacter>) => {
      const parser = this.resolve(identifier);
      const result = parser(characters);

      if (result.token) {
        const wrapper = this.createToken([], identifier);
        wrapper.addChildren(result.token as Token);

        return {
          characters: result.characters,
          optional: result.optional,
          token: wrapper,
        };
      }

      return result;
    };
  }

  resolve(identifier: string): IParser {
    return (characters: ICollection<ICharacter>) => {
      if (this.symbolMap.has(identifier)) {
        return this.symbolMap.get(identifier)(characters);
      } else {
        throw new LexerException(`Identifier not registered!`, {
          identifier,
        });
      }
    };
  }
}
