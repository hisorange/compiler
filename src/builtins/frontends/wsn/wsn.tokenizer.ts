import { ITokenizer } from '../../../components/parser/interfaces/tokenizer.interface';
import { Tokenizer } from '../../../components/parser/tokenizer';
import { WSNIdentifier } from './wsn.identifier';

export class WSNTokenizer extends Tokenizer implements ITokenizer {
  prepare() {
    const T = this;
    T.identifier(WSNIdentifier.EOL, T.literal(`\n`));
    T.identifier(WSNIdentifier.SPACE, T.literal(` `));
    T.identifier(WSNIdentifier.TAB, T.literal(`\t`));
    T.identifier(
      WSNIdentifier.WS,
      T.repetition(T.or([T.resolve(WSNIdentifier.SPACE), T.resolve(WSNIdentifier.EOL), T.resolve(WSNIdentifier.TAB)])),
    );
    T.identifier(WSNIdentifier.UNDERSCORE, T.literal(`_`));
    T.identifier(WSNIdentifier.SINGLE_QUOTE, T.literal(`'`));
    T.identifier(WSNIdentifier.DOUBLE_QUOTE, T.literal(`"`));
    T.identifier(
      WSNIdentifier.QUOTES,
      T.or([T.resolve(WSNIdentifier.SINGLE_QUOTE), T.resolve(WSNIdentifier.DOUBLE_QUOTE)]),
    );
    T.identifier(
      WSNIdentifier.LETTER,
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
      WSNIdentifier.DIGIT,
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
      ]),
    );
    T.identifier(
      WSNIdentifier.CHARACTER,
      T.or([T.resolve(WSNIdentifier.LETTER), T.resolve(WSNIdentifier.DIGIT), T.resolve(WSNIdentifier.SYMBOL)]),
    );
    T.identifier(
      WSNIdentifier.TEXT,
      T.or([
        T.resolve(WSNIdentifier.LETTER),
        T.resolve(WSNIdentifier.DIGIT),
        T.resolve(WSNIdentifier.SYMBOL),
        T.resolve(WSNIdentifier.SPACE),
        T.resolve(WSNIdentifier.TAB),
        T.resolve(WSNIdentifier.QUOTES),
      ]),
    );
    T.identifier(WSNIdentifier.ALIAS, T.concat([T.literal(`&`), T.resolve(WSNIdentifier.IDENTIFIER)]));
    T.identifier(
      WSNIdentifier.IDENTIFIER,
      T.concat([
        T.resolve(WSNIdentifier.LETTER),
        T.repetition(T.or([T.resolve(WSNIdentifier.LETTER), T.resolve(WSNIdentifier.UNDERSCORE)])),
      ]),
    );
    T.identifier(
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
    );
    T.identifier(
      WSNIdentifier.FACTOR,
      T.or([
        T.concat([T.literal(`{`), T.resolve(WSNIdentifier.EXPRESSION), T.literal(`}`)]),
        T.concat([T.literal(`(`), T.resolve(WSNIdentifier.EXPRESSION), T.literal(`)`)]),
        T.concat([T.literal(`[`), T.resolve(WSNIdentifier.EXPRESSION), T.literal(`]`)]),
        T.alias(WSNIdentifier.LITERAL),
        T.resolve(WSNIdentifier.LITERAL),
        T.alias(WSNIdentifier.IDENTIFIER),
        T.resolve(WSNIdentifier.IDENTIFIER),
        T.alias(WSNIdentifier.ALIAS),
        T.resolve(WSNIdentifier.ALIAS),
      ]),
    );
    T.identifier(
      WSNIdentifier.TERM,
      T.concat([
        T.resolve(WSNIdentifier.WS),
        T.resolve(WSNIdentifier.FACTOR),
        T.repetition(T.concat([T.resolve(WSNIdentifier.WS), T.resolve(WSNIdentifier.FACTOR)])),
        T.resolve(WSNIdentifier.WS),
      ]),
    );
    T.identifier(
      WSNIdentifier.EXPRESSION,
      T.concat([
        T.resolve(WSNIdentifier.TERM),
        T.repetition(T.concat([T.literal(`|`), T.resolve(WSNIdentifier.TERM)])),
      ]),
    );
    T.identifier(
      WSNIdentifier.CHANNEL,
      T.concat([
        T.literal(`->`),
        T.resolve(WSNIdentifier.WS),
        T.resolve(WSNIdentifier.LETTER),
        T.repetition(T.resolve(WSNIdentifier.LETTER)),
      ]),
    );
    T.identifier(
      WSNIdentifier.PRODUCTION,
      T.concat([
        T.repetition(T.or([T.resolve(WSNIdentifier.WS), T.resolve(WSNIdentifier.COMMENT)])),
        T.resolve(WSNIdentifier.IDENTIFIER),
        T.resolve(WSNIdentifier.WS),
        T.literal(`=`),
        T.resolve(WSNIdentifier.EXPRESSION),
        T.repetition(T.resolve(WSNIdentifier.CHANNEL)),
        T.literal(`.`),
        T.repetition(T.or([T.resolve(WSNIdentifier.WS), T.resolve(WSNIdentifier.COMMENT)])),
      ]),
    );
    T.identifier(
      WSNIdentifier.SYNTAX,
      T.concat([T.optional(T.resolve(WSNIdentifier.GRAMMAR)), T.repetition(T.resolve(WSNIdentifier.PRODUCTION))]),
    );
    T.identifier(
      WSNIdentifier.GRAMMAR,
      T.concat([
        T.literal(`:`),
        T.resolve(WSNIdentifier.LETTER),
        T.repetition(T.resolve(WSNIdentifier.LETTER)),
        T.literal(`:`),
      ]),
    );
    T.identifier(
      WSNIdentifier.COMMENT,
      T.concat([T.literal(`#`), T.repetition(T.resolve(WSNIdentifier.TEXT)), T.optional(T.resolve(WSNIdentifier.EOL))]),
    );
  }
}
