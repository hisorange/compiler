import { ITokenizer } from '../../../components/parser/interfaces/tokenizer.interface';
import { Tokenizer } from '../../../components/parser/tokenizer';
import { AMLIdentifier } from './aml.identifier';

export class AMLTokenizer extends Tokenizer implements ITokenizer {
  prepare() {
    const T = this;
    T.identifier(AMLIdentifier.EOL,
  T.literal(`\n`)
, `main`
);
    T.identifier(AMLIdentifier.SPACE,
  T.literal(` `)
, `main`
);
    T.identifier(AMLIdentifier.WS,
  T.repetition(
  T.or([
      T.resolve(AMLIdentifier.SPACE)
,      T.resolve(AMLIdentifier.EOL)
,  ])
,  )
, `main`
);
    T.identifier(AMLIdentifier.LETTER,
  T.or([
  T.literal(`A`)
,  T.literal(`a`)
,  T.literal(`B`)
,  T.literal(`b`)
,  T.literal(`C`)
,  T.literal(`c`)
,  T.literal(`D`)
,  T.literal(`d`)
,  T.literal(`E`)
,  T.literal(`e`)
,  T.literal(`F`)
,  T.literal(`f`)
,  T.literal(`G`)
,  T.literal(`g`)
,  T.literal(`H`)
,  T.literal(`h`)
,  T.literal(`I`)
,  T.literal(`i`)
,  T.literal(`J`)
,  T.literal(`j`)
,  T.literal(`K`)
,  T.literal(`k`)
,  T.literal(`L`)
,  T.literal(`l`)
,  T.literal(`M`)
,  T.literal(`m`)
,  T.literal(`N`)
,  T.literal(`n`)
,  T.literal(`O`)
,  T.literal(`o`)
,  T.literal(`P`)
,  T.literal(`p`)
,  T.literal(`Q`)
,  T.literal(`q`)
,  T.literal(`R`)
,  T.literal(`r`)
,  T.literal(`S`)
,  T.literal(`s`)
,  T.literal(`T`)
,  T.literal(`t`)
,  T.literal(`U`)
,  T.literal(`u`)
,  T.literal(`V`)
,  T.literal(`v`)
,  T.literal(`W`)
,  T.literal(`w`)
,  T.literal(`X`)
,  T.literal(`x`)
,  T.literal(`Y`)
,  T.literal(`y`)
,  T.literal(`Z`)
,  T.literal(`z`)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.TYPE_NAME,
      T.resolve(AMLIdentifier.SYMBOL_NAME)
, `main`
);
    T.identifier(AMLIdentifier.TYPE,
  T.concat([
  T.literal(`<`)
,      T.resolve(AMLIdentifier.TYPE_NAME)
,  T.literal(`>`)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.FIELD_NAME,
      T.resolve(AMLIdentifier.SYMBOL_NAME)
, `main`
);
    T.identifier(AMLIdentifier.FIELD_MODIFIER,
  T.or([
  T.literal(`primary`)
,  T.literal(`unique`)
,  T.literal(`indexed`)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.FIELD,
  T.concat([
      T.resolve(AMLIdentifier.WS)
,  T.repetition(
  T.concat([
      T.resolve(AMLIdentifier.FIELD_MODIFIER)
,      T.resolve(AMLIdentifier.WS)
,  ])
,  )
,  T.literal(`field`)
,      T.resolve(AMLIdentifier.WS)
,      T.resolve(AMLIdentifier.FIELD_NAME)
,  T.optional(
      T.resolve(AMLIdentifier.TYPE)
,  )
,      T.resolve(AMLIdentifier.EOL)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.MESSAGE_NAME,
      T.resolve(AMLIdentifier.SYMBOL_NAME)
, `main`
);
    T.identifier(AMLIdentifier.MESSAGE,
  T.concat([
  T.literal(`message`)
,      T.resolve(AMLIdentifier.WS)
,      T.resolve(AMLIdentifier.MESSAGE_NAME)
,      T.resolve(AMLIdentifier.WS)
,  T.literal(`{`)
,  T.repetition(
  T.or([
      T.resolve(AMLIdentifier.FIELD)
,      T.resolve(AMLIdentifier.WS)
,  ])
,  )
,  T.literal(`}`)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.RPC_NAME,
      T.resolve(AMLIdentifier.SYMBOL_NAME)
, `main`
);
    T.identifier(AMLIdentifier.REQUEST,
      T.resolve(AMLIdentifier.MESSAGE_NAME)
, `main`
);
    T.identifier(AMLIdentifier.SUCCESS,
      T.resolve(AMLIdentifier.MESSAGE_NAME)
, `main`
);
    T.identifier(AMLIdentifier.ERROR,
      T.resolve(AMLIdentifier.MESSAGE_NAME)
, `main`
);
    T.identifier(AMLIdentifier.RPC,
  T.concat([
      T.resolve(AMLIdentifier.WS)
,  T.literal(`rpc`)
,      T.resolve(AMLIdentifier.WS)
,      T.resolve(AMLIdentifier.RPC_NAME)
,  T.literal(`(`)
,      T.resolve(AMLIdentifier.REQUEST)
,  T.literal(`)`)
,      T.resolve(AMLIdentifier.WS)
,  T.literal(`->`)
,      T.resolve(AMLIdentifier.WS)
,  T.literal(`<`)
,      T.resolve(AMLIdentifier.ERROR)
,  T.literal(`,`)
,      T.resolve(AMLIdentifier.WS)
,      T.resolve(AMLIdentifier.SUCCESS)
,  T.literal(`>`)
,      T.resolve(AMLIdentifier.EOL)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.SERVICE_NAME,
      T.resolve(AMLIdentifier.SYMBOL_NAME)
, `main`
);
    T.identifier(AMLIdentifier.SERVICE,
  T.concat([
  T.literal(`service`)
,      T.resolve(AMLIdentifier.WS)
,      T.resolve(AMLIdentifier.SERVICE_NAME)
,      T.resolve(AMLIdentifier.WS)
,  T.literal(`{`)
,  T.repetition(
  T.or([
      T.resolve(AMLIdentifier.RPC)
,      T.resolve(AMLIdentifier.WS)
,  ])
,  )
,  T.literal(`}`)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.G_DOMAIN,
  T.concat([
  T.literal(`$`)
,  T.literal(`domain`)
,      T.resolve(AMLIdentifier.WS)
,  T.literal(`{`)
,  T.repetition(
  T.or([
      T.resolve(AMLIdentifier.FIELD)
,      T.resolve(AMLIdentifier.WS)
,      T.resolve(AMLIdentifier.COMMENT)
,  ])
,  )
,  T.literal(`}`)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.ENUM_VALUE,
  T.concat([
  T.optional(
  T.concat([
  T.literal(`default`)
,      T.resolve(AMLIdentifier.WS)
,  ])
,  )
,  T.literal(`value`)
,      T.resolve(AMLIdentifier.WS)
,      T.resolve(AMLIdentifier.SYMBOL_NAME)
,  T.repetition(
      T.resolve(AMLIdentifier.WS)
,  )
,      T.resolve(AMLIdentifier.EOL)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.ENUM,
  T.concat([
  T.literal(`enum`)
,      T.resolve(AMLIdentifier.WS)
,      T.resolve(AMLIdentifier.SYMBOL_NAME)
,      T.resolve(AMLIdentifier.WS)
,  T.literal(`{`)
,  T.repetition(
      T.resolve(AMLIdentifier.ENUM_VALUE)
,  )
,  T.literal(`}`)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.GLOBAL_OVERIDES,
      T.resolve(AMLIdentifier.G_DOMAIN)
, `main`
);
    T.identifier(AMLIdentifier.COMMENT,
  T.concat([
  T.literal(`#`)
,  T.repetition(
  T.or([
      T.resolve(AMLIdentifier.LETTER)
,      T.resolve(AMLIdentifier.WS)
,  ])
,  )
,      T.resolve(AMLIdentifier.EOL)
,  ])
, `main`
);
    T.identifier(AMLIdentifier.SYMBOL_NAME,
  T.concat([
      T.resolve(AMLIdentifier.LETTER)
,  T.repetition(
      T.resolve(AMLIdentifier.LETTER)
,  )
,  ])
, `main`
);
    T.identifier(AMLIdentifier.SYNTAX,
  T.repetition(
  T.or([
      T.resolve(AMLIdentifier.G_DOMAIN)
,      T.resolve(AMLIdentifier.ENUM)
,      T.resolve(AMLIdentifier.SERVICE)
,      T.resolve(AMLIdentifier.MESSAGE)
,      T.resolve(AMLIdentifier.WS)
,      T.resolve(AMLIdentifier.COMMENT)
,  ])
,  )
, `main`
);
      }
}
