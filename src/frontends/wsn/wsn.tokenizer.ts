import { Tokenizer } from '../../components/tokenizer.old';
import { ITokenizer } from '../../interfaces/components/tokenizer.interface';

export class WSNTokenizer extends Tokenizer implements ITokenizer {
  prepare() {
    const T = this;

    // Identifiers
    T.identifier(`EOL`, T.literal(`\n`));

    T.identifier(`SPACE`, T.literal(` `));

    T.identifier(`TAB`, T.literal(`\t`));

    T.identifier(
      `WS`,
      T.repetition(T.or([T.alias(`SPACE`), T.alias(`EOL`), T.alias(`TAB`)])),
    );

    T.identifier(`UNDERSCORE`, T.literal(`_`));

    T.identifier(`SINGLE_QUOTE`, T.literal(`'`));

    T.identifier(`DOUBLE_QUOTE`, T.literal(`"`));

    T.identifier(
      `QUOTES`,
      T.or([T.alias(`SINGLE_QUOTE`), T.alias(`DOUBLE_QUOTE`)]),
    );

    T.identifier(
      `LETTER`,
      T.or([
        T.literal(`A`),
        T.literal(`a`),
        T.literal(`B`),
        T.literal(`b`),
        T.literal(`C`),
        T.literal(`c`),
        T.literal(`D`),
        T.literal(`d`),
        T.literal(`E`),
        T.literal(`e`),
        T.literal(`F`),
        T.literal(`f`),
        T.literal(`G`),
        T.literal(`g`),
        T.literal(`H`),
        T.literal(`h`),
        T.literal(`I`),
        T.literal(`i`),
        T.literal(`J`),
        T.literal(`j`),
        T.literal(`K`),
        T.literal(`k`),
        T.literal(`L`),
        T.literal(`l`),
        T.literal(`M`),
        T.literal(`m`),
        T.literal(`N`),
        T.literal(`n`),
        T.literal(`O`),
        T.literal(`o`),
        T.literal(`P`),
        T.literal(`p`),
        T.literal(`Q`),
        T.literal(`q`),
        T.literal(`R`),
        T.literal(`r`),
        T.literal(`S`),
        T.literal(`s`),
        T.literal(`T`),
        T.literal(`t`),
        T.literal(`U`),
        T.literal(`u`),
        T.literal(`V`),
        T.literal(`v`),
        T.literal(`W`),
        T.literal(`w`),
        T.literal(`X`),
        T.literal(`x`),
        T.literal(`Y`),
        T.literal(`y`),
        T.literal(`Z`),
        T.literal(`z`),
      ]),
    );

    T.identifier(
      `DIGIT`,
      T.or([
        T.literal(`0`),
        T.literal(`1`),
        T.literal(`2`),
        T.literal(`3`),
        T.literal(`4`),
        T.literal(`5`),
        T.literal(`6`),
        T.literal(`7`),
        T.literal(`8`),
        T.literal(`9`),
      ]),
    );

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
      ]),
    );

    T.identifier(
      `CHARACTER`,
      T.or([T.alias(`LETTER`), T.alias(`DIGIT`), T.alias(`SYMBOL`)]),
    );

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
      T.concat([
        T.resolve(`LETTER`),
        T.repetition(T.or([T.alias(`LETTER`), T.alias(`UNDERSCORE`)])),
      ]),
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

    T.identifier(
      `FACTOR`,
      T.or([
        T.concat([T.literal(`{`), T.resolve(`EXPRESSION`), T.literal(`}`)]),
        T.concat([T.literal(`(`), T.resolve(`EXPRESSION`), T.literal(`)`)]),
        T.concat([T.literal(`[`), T.resolve(`EXPRESSION`), T.literal(`]`)]),
        T.concat([
          T.literal(`/`),
          T.concat([
            T.resolve(`CHARACTER`),
            T.repetition(T.resolve(`CHARACTER`)),
          ]),
          T.literal(`/`),
        ]),
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
      T.concat([
        T.resolve(`TERM`),
        T.repetition(T.concat([T.literal(`|`), T.resolve(`TERM`)])),
      ]),
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

    T.identifier(
      `SYNTAX`,
      T.concat([
        T.optional(T.resolve(`GRAMMAR`)),
        T.repetition(T.resolve(`PRODUCTION`)),
      ]),
    );

    T.identifier(
      `GRAMMAR`,
      T.concat([
        T.literal(`:`),
        T.resolve(`LETTER`),
        T.repetition(T.resolve(`LETTER`)),
        T.literal(`:`),
      ]),
    );

    T.identifier(
      `COMMENT`,
      T.concat([
        T.literal(`#`),
        T.repetition(T.resolve(`TEXT`)),
        T.optional(T.resolve(`EOL`)),
      ]),
    );
  }
}