import { ITokenizer } from '../../../components/parser/interfaces/tokenizer.interface';
import { Tokenizer } from '../../../components/parser/tokenizer';

export class WSNTokenizer extends Tokenizer implements ITokenizer {
  prepare() {
    const T = this;

    // Identifiers
    T.identifier(`EOL`, T.literal(`\n`));
    T.identifier(`SPACE`, T.literal(` `));
    T.identifier(`TAB`, T.literal(`\t`));
    T.identifier(`WS`, T.repetition(T.or([T.alias(`SPACE`), T.alias(`EOL`), T.alias(`TAB`)])));
    T.identifier(`UNDERSCORE`, T.literal(`_`));
    T.identifier(`SINGLE_QUOTE`, T.literal(`'`));
    T.identifier(`DOUBLE_QUOTE`, T.literal(`"`));
    T.identifier(`QUOTES`, T.or([T.alias(`SINGLE_QUOTE`), T.alias(`DOUBLE_QUOTE`)]));
    T.identifier(`LETTER`, T.regexp(/[a-zA-Z]/));
    T.identifier(`DIGIT`, T.regexp(/[0-9]/));

    T.identifier(
      `SYMBOL`,
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
        T.literal(`^`),
      ]),
    );

    T.identifier(`CHARACTER`, T.or([T.alias(`LETTER`), T.alias(`DIGIT`), T.alias(`SYMBOL`)]));

    T.identifier(
      `TEXT`,
      T.or([
        T.alias(`LETTER`),
        T.alias(`DIGIT`),
        T.alias(`SYMBOL`),
        T.alias(`SPACE`),
        T.alias(`TAB`),
        T.alias(`QUOTES`),
      ]),
    );

    T.identifier(
      `IDENTIFIER`,
      T.concat([T.resolve(`LETTER`), T.repetition(T.or([T.alias(`LETTER`), T.alias(`UNDERSCORE`)]))]),
    );

    T.identifier(
      `LITERAL`,
      T.or([
        T.concat([
          T.resolve(`SINGLE_QUOTE`),
          T.repetition(
            T.or([
              T.alias(`CHARACTER`),
              T.alias(`SPACE`),
              T.alias(`SYMBOL`),
              T.alias(`UNDERSCORE`),
              T.alias(`DOUBLE_QUOTE`),
            ]),
          ),
          T.resolve(`SINGLE_QUOTE`),
        ]),
        T.concat([
          T.resolve(`DOUBLE_QUOTE`),
          T.repetition(
            T.or([
              T.alias(`CHARACTER`),
              T.alias(`SPACE`),
              T.alias(`SYMBOL`),
              T.alias(`UNDERSCORE`),
              T.alias(`SINGLE_QUOTE`),
            ]),
          ),
          T.resolve(`DOUBLE_QUOTE`),
        ]),
      ]),
    );

    T.identifier(`REGEXP`, T.concat([T.literal(`/`), T.repetition(T.regexp(/[^\/]/)), T.literal(`/`)]));

    T.identifier(
      `FACTOR`,
      T.or([
        T.concat([T.literal(`{`), T.resolve(`EXPRESSION`), T.literal(`}`)]),
        T.concat([T.literal(`(`), T.resolve(`EXPRESSION`), T.literal(`)`)]),
        T.concat([T.literal(`[`), T.resolve(`EXPRESSION`), T.literal(`]`)]),
        T.alias(`REGEXP`),
        T.alias(`LITERAL`),
        T.alias(`IDENTIFIER`),
      ]),
    );

    T.identifier(
      `TERM`,
      T.concat([
        T.resolve(`WS`),
        T.resolve(`FACTOR`),
        T.repetition(T.concat([T.resolve(`WS`), T.resolve(`FACTOR`)])),
        T.resolve(`WS`),
      ]),
    );

    T.identifier(
      `EXPRESSION`,
      T.concat([T.resolve(`TERM`), T.repetition(T.concat([T.literal(`|`), T.resolve(`TERM`)]))]),
    );

    T.identifier(
      `PRODUCTION`,
      T.concat([
        T.repetition(T.or([T.alias(`WS`), T.alias(`COMMENT`)])),
        T.resolve(`IDENTIFIER`),
        T.resolve(`WS`),
        T.literal(`=`),
        T.resolve(`EXPRESSION`),
        T.literal(`.`),
        T.repetition(T.or([T.alias(`WS`), T.alias(`COMMENT`)])),
      ]),
    );

    T.identifier(`SYNTAX`, T.concat([T.optional(T.resolve(`GRAMMAR`)), T.repetition(T.resolve(`PRODUCTION`))]));

    T.identifier(
      `GRAMMAR`,
      T.concat([T.literal(`:`), T.resolve(`LETTER`), T.repetition(T.resolve(`LETTER`)), T.literal(`:`)]),
    );

    T.identifier(`COMMENT`, T.concat([T.literal(`#`), T.repetition(T.resolve(`TEXT`)), T.optional(T.resolve(`EOL`))]));
  }
}
