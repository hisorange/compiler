import { Tokenizer } from '../../components/tokenizer.old';
import { AMLIdentifier } from './aml.identifiers';

export class AMLTokenizer extends Tokenizer {
  prepare() {
    const T = this;

    // Identifiers
    T.identifier(AMLIdentifier.EOL, T.literal(`\n`));

    T.identifier(AMLIdentifier.SPACE, T.literal(` `));

    T.identifier(AMLIdentifier.WS, T.repetition(T.or([T.resolve(AMLIdentifier.SPACE), T.resolve(AMLIdentifier.EOL)])));

    T.identifier(
      AMLIdentifier.LETTER,
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

    T.identifier(AMLIdentifier.TYPE_NAME, T.resolve(AMLIdentifier.SYMBOL_NAME));

    T.identifier(AMLIdentifier.TYPE, T.concat([T.literal(`<`), T.resolve(AMLIdentifier.TYPE_NAME), T.literal(`>`)]));

    T.identifier(AMLIdentifier.FIELD_NAME, T.resolve(AMLIdentifier.SYMBOL_NAME));

    T.identifier(
      AMLIdentifier.FIELD,
      T.concat([
        T.resolve(AMLIdentifier.WS),
        T.literal(`field`),
        T.resolve(AMLIdentifier.SPACE),
        T.resolve(AMLIdentifier.FIELD_NAME),
        T.optional(T.resolve(AMLIdentifier.TYPE)),
        T.resolve(AMLIdentifier.EOL),
      ]),
    );

    T.identifier(AMLIdentifier.MESSAGE_NAME, T.resolve(AMLIdentifier.SYMBOL_NAME));

    T.identifier(
      AMLIdentifier.MESSAGE,
      T.concat([
        T.literal(`message`),
        T.resolve(AMLIdentifier.SPACE),
        T.resolve(AMLIdentifier.MESSAGE_NAME),
        T.resolve(AMLIdentifier.SPACE),
        T.literal(`{`),
        T.repetition(T.or([T.resolve(AMLIdentifier.FIELD), T.resolve(AMLIdentifier.WS)])),
        T.literal(`}`),
      ]),
    );

    T.identifier(AMLIdentifier.RPC_NAME, T.resolve(AMLIdentifier.SYMBOL_NAME));

    T.identifier(AMLIdentifier.REQUEST, T.resolve(AMLIdentifier.MESSAGE_NAME));

    T.identifier(AMLIdentifier.SUCCESS, T.resolve(AMLIdentifier.MESSAGE_NAME));

    T.identifier(AMLIdentifier.ERROR, T.resolve(AMLIdentifier.MESSAGE_NAME));

    T.identifier(
      AMLIdentifier.RPC,
      T.concat([
        T.resolve(AMLIdentifier.WS),
        T.literal(`rpc`),
        T.resolve(AMLIdentifier.SPACE),
        T.resolve(AMLIdentifier.RPC_NAME),
        T.literal(`(`),
        T.resolve(AMLIdentifier.REQUEST),
        T.literal(`)`),
        T.resolve(AMLIdentifier.SPACE),
        T.literal(`->`),
        T.resolve(AMLIdentifier.SPACE),
        T.literal(`<`),
        T.resolve(AMLIdentifier.ERROR),
        T.literal(`,`),
        T.resolve(AMLIdentifier.SPACE),
        T.resolve(AMLIdentifier.SUCCESS),
        T.literal(`>`),
        T.resolve(AMLIdentifier.EOL),
      ]),
    );

    T.identifier(AMLIdentifier.SERVICE_NAME, T.resolve(AMLIdentifier.SYMBOL_NAME));

    T.identifier(
      AMLIdentifier.SERVICE,
      T.concat([
        T.literal(`service`),
        T.resolve(AMLIdentifier.SPACE),
        T.resolve(AMLIdentifier.SERVICE_NAME),
        T.resolve(AMLIdentifier.SPACE),
        T.literal(`{`),
        T.repetition(T.or([T.resolve(AMLIdentifier.RPC), T.resolve(AMLIdentifier.WS)])),
        T.literal(`}`),
      ]),
    );

    T.identifier(
      AMLIdentifier.COMMENT,
      T.concat([
        T.literal(`#`),
        T.repetition(T.or([T.resolve(AMLIdentifier.LETTER), T.resolve(AMLIdentifier.SPACE)])),
        T.resolve(AMLIdentifier.EOL),
      ]),
    );

    T.identifier(
      AMLIdentifier.SYMBOL_NAME,
      T.concat([T.resolve(AMLIdentifier.LETTER), T.repetition(T.resolve(AMLIdentifier.LETTER))]),
    );

    T.identifier(
      AMLIdentifier.SYNTAX,
      T.repetition(
        T.or([
          T.resolve(AMLIdentifier.SERVICE),
          T.resolve(AMLIdentifier.MESSAGE),
          T.resolve(AMLIdentifier.WS),
          T.resolve(AMLIdentifier.COMMENT),
        ]),
      ),
    );
  }
}
