import { Frontend, IFrontend } from '../../../components';
import { IdentifierInterpreter, ProductionInterpreter, SyntaxInterpreter } from './interpreters';
import {
  AliasLexer,
  ChannelLexer,
  GrammarLexer,
  IdentifierLexer,
  LiteralLexer,
  LogicalLexer,
  ProductionLexer,
  RegexpLexer,
} from './lexers';
import { WSNTokenizer } from './wsn.tokenizer';

@Frontend({
  name: 'Writh Syntax Notation',
  reference: 'wsn',
  extensions: ['wsn'],
  tokenizer: WSNTokenizer,
  lexers: [
    GrammarLexer,
    LiteralLexer,
    IdentifierLexer,
    ProductionLexer,
    AliasLexer,
    ChannelLexer,
    RegexpLexer,
    LogicalLexer,
  ],
  interpreters: [SyntaxInterpreter, ProductionInterpreter, IdentifierInterpreter],
})
export class WSNFrontend implements IFrontend {
  onInit() {}
}
