import { IParserManager } from '../../../components/parser/interfaces/parser-manager.interface';
import { AbstractParserManager } from '../../../components/parser/parser-manager';
import { WSNIdentifier } from './wsn.identifier';

export class WSNParserManager
  extends AbstractParserManager
  implements IParserManager
{
  prepare() {
    const T = this;

    T.addSyntax(WSNIdentifier.EOL, T.literal(`\n`), `whitespace`);
    T.addSyntax(WSNIdentifier.SPACE, T.literal(` `), `whitespace`);
    T.addSyntax(WSNIdentifier.TAB, T.literal(`\t`), `whitespace`);

    T.addSyntax(
      WSNIdentifier.WS,
      T.repetition(
        T.or([
          T.resolve(WSNIdentifier.SPACE),
          T.resolve(WSNIdentifier.EOL),
          T.resolve(WSNIdentifier.TAB),
        ]),
      ),
      `whitespace`,
    );
    T.addSyntax(WSNIdentifier.UNDERSCORE, T.literal(`_`), `main`);
    T.addSyntax(WSNIdentifier.SINGLE_QUOTE, T.literal(`'`), `main`);
    T.addSyntax(WSNIdentifier.DOUBLE_QUOTE, T.literal(`"`), `main`);
    T.addSyntax(
      WSNIdentifier.QUOTES,
      T.or([
        T.resolve(WSNIdentifier.SINGLE_QUOTE),
        T.resolve(WSNIdentifier.DOUBLE_QUOTE),
      ]),
      `main`,
    );
    T.addSyntax(WSNIdentifier.LETTER, T.regexp(/[a-zA-Z]/), `main`);
    T.addSyntax(WSNIdentifier.DIGIT, T.regexp(/[0-9]/), `main`);
    T.addSyntax(
      WSNIdentifier.SYMBOL,
      T.or([
        T.literal(`=`),
        T.literal(`;`),
        T.literal(`[`),
        T.literal(`]`),
        T.literal(`{`),
        T.literal(`}`),
        T.literal(`(`),
        T.literal(`)`),
        T.literal(`.`),
        T.literal(`|`),
        T.literal(`\\`),
        T.literal(`#`),
        T.literal(`,`),
        T.literal(`!`),
        T.literal(`<`),
        T.literal(`>`),
        T.literal(`/`),
        T.literal(`:`),
        T.literal(`-`),
        T.literal(`~`),
        T.literal(`&`),
        T.literal(`$`),
      ]),
      `main`,
    );
    T.addSyntax(
      WSNIdentifier.REGEXP,
      T.concat([
        T.literal(`/`),
        T.repetition(
          T.or([
            T.resolve(WSNIdentifier.LETTER),
            T.literal(`-`),
            T.literal(`[`),
            T.literal(`]`),
            T.resolve(WSNIdentifier.DIGIT),
          ]),
        ),
        T.literal(`/`),
      ]),
      `main`,
    );
    T.addSyntax(
      WSNIdentifier.CHARACTER,
      T.or([
        T.resolve(WSNIdentifier.LETTER),
        T.resolve(WSNIdentifier.DIGIT),
        T.resolve(WSNIdentifier.SYMBOL),
      ]),
      `main`,
    );
    T.addSyntax(
      WSNIdentifier.TEXT,
      T.or([
        T.resolve(WSNIdentifier.LETTER),
        T.resolve(WSNIdentifier.DIGIT),
        T.resolve(WSNIdentifier.SYMBOL),
        T.resolve(WSNIdentifier.SPACE),
        T.resolve(WSNIdentifier.TAB),
        T.resolve(WSNIdentifier.QUOTES),
      ]),
      `main`,
    );
    T.addSyntax(
      WSNIdentifier.ALIAS,
      T.concat([T.literal(`&`), T.resolve(WSNIdentifier.IDENTIFIER)]),
      `main`,
    );

    T.addToken(
      WSNIdentifier.IDENTIFIER,
      T.concat([
        T.resolve(WSNIdentifier.LETTER),
        T.repetition(
          T.or([
            T.resolve(WSNIdentifier.LETTER),
            T.resolve(WSNIdentifier.UNDERSCORE),
          ]),
        ),
      ]),
      `main`,
    );

    T.addSyntax(
      WSNIdentifier.LITERAL,
      T.or([
        T.concat([
          T.resolve(WSNIdentifier.SINGLE_QUOTE),
          T.repetition(
            T.or([
              T.resolve(WSNIdentifier.CHARACTER),
              T.resolve(WSNIdentifier.SPACE),
              T.resolve(WSNIdentifier.SYMBOL),
              T.resolve(WSNIdentifier.UNDERSCORE),
              T.resolve(WSNIdentifier.DOUBLE_QUOTE),
            ]),
          ),
          T.resolve(WSNIdentifier.SINGLE_QUOTE),
        ]),
        T.concat([
          T.resolve(WSNIdentifier.DOUBLE_QUOTE),
          T.repetition(
            T.or([
              T.resolve(WSNIdentifier.CHARACTER),
              T.resolve(WSNIdentifier.SPACE),
              T.resolve(WSNIdentifier.SYMBOL),
              T.resolve(WSNIdentifier.UNDERSCORE),
              T.resolve(WSNIdentifier.SINGLE_QUOTE),
            ]),
          ),
          T.resolve(WSNIdentifier.DOUBLE_QUOTE),
        ]),
      ]),
      `main`,
    );

    T.addSyntax(
      WSNIdentifier.FACTOR,
      T.or([
        T.concat([
          T.literal(`{`),
          T.resolve(WSNIdentifier.EXPRESSION),
          T.literal(`}`),
        ]),
        T.concat([
          T.literal(`(`),
          T.resolve(WSNIdentifier.EXPRESSION),
          T.literal(`)`),
        ]),
        T.concat([
          T.literal(`[`),
          T.resolve(WSNIdentifier.EXPRESSION),
          T.literal(`]`),
        ]),
        T.alias(WSNIdentifier.REGEXP),
        T.resolve(WSNIdentifier.REGEXP),
        T.alias(WSNIdentifier.LITERAL),
        T.resolve(WSNIdentifier.LITERAL),
        T.alias(WSNIdentifier.IDENTIFIER),
        T.resolve(WSNIdentifier.IDENTIFIER),
        T.alias(WSNIdentifier.ALIAS),
        T.resolve(WSNIdentifier.ALIAS),
      ]),
      `main`,
    );
    T.addSyntax(
      WSNIdentifier.TERM,
      T.concat([
        T.resolve(WSNIdentifier.WS),
        T.resolve(WSNIdentifier.FACTOR),
        T.repetition(
          T.concat([
            T.resolve(WSNIdentifier.WS),
            T.resolve(WSNIdentifier.FACTOR),
          ]),
        ),
        T.resolve(WSNIdentifier.WS),
      ]),
      `main`,
    );

    T.addToken(
      WSNIdentifier.EXPRESSION,
      T.concat([
        T.resolve(WSNIdentifier.TERM),
        T.repetition(T.concat([T.literal(`|`), T.resolve(WSNIdentifier.TERM)])),
      ]),
      `main`,
    );

    T.addToken(
      WSNIdentifier.PRODUCTION,
      T.concat([
        T.repetition(
          T.or([T.resolve(WSNIdentifier.WS), T.resolve(WSNIdentifier.COMMENT)]),
        ),
        T.resolve(WSNIdentifier.WS),
        T.or([T.literal('token'), T.literal('syntax')]),
        T.resolve(WSNIdentifier.IDENTIFIER),
        T.resolve(WSNIdentifier.WS),
        T.literal(`=`),
        T.resolve(WSNIdentifier.EXPRESSION),
        T.repetition(T.resolve(WSNIdentifier.CHANNEL)),
        T.literal(`.`),
        T.repetition(
          T.or([T.resolve(WSNIdentifier.WS), T.resolve(WSNIdentifier.COMMENT)]),
        ),
      ]),
      `main`,
    );

    T.addToken(
      WSNIdentifier.SYNTAX,
      T.concat([
        T.optional(T.resolve(WSNIdentifier.GRAMMAR)),
        T.repetition(T.resolve(WSNIdentifier.PRODUCTION)),
      ]),
      `main`,
    );

    T.addToken(
      WSNIdentifier.GRAMMAR_NAME,
      T.concat([
        T.resolve(WSNIdentifier.LETTER),
        T.repetition(T.resolve(WSNIdentifier.LETTER)),
      ]),
      `main`,
    );

    T.addToken(
      WSNIdentifier.GRAMMAR,
      T.concat([
        T.literal(`:`),
        T.resolve(WSNIdentifier.GRAMMAR_NAME),
        T.literal(`:`),
      ]),
      `main`,
    );

    T.addToken(
      WSNIdentifier.COMMENT,
      T.concat([
        T.literal(`#`),
        T.repetition(T.resolve(WSNIdentifier.TEXT)),
        T.optional(T.resolve(WSNIdentifier.EOL)),
      ]),
      `comment`,
    );

    T.addToken(
      WSNIdentifier.CHANNEL,
      T.concat([
        T.literal(`->`),
        T.resolve(WSNIdentifier.WS),
        T.resolve(WSNIdentifier.LETTER),
        T.repetition(T.resolve(WSNIdentifier.LETTER)),
        T.resolve(WSNIdentifier.WS),
      ]),
      `main`,
    );
  }
}
