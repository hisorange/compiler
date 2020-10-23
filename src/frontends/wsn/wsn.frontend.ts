import { Frontend } from '../../decorators/frontend.decorator';
import { IFrontend } from '../../interfaces/frontend.interface';
import { IdentifierInterpreter } from './interpreters/identifier.interpreter';
import { ProductionInterpreter } from './interpreters/production.interpreter';
import { SyntaxInterpreter } from './interpreters/syntax.interpreter';
import { GrammarLexer } from './lexers/grammar.lexer';
import { IdentifierLexer } from './lexers/identifier.lexer';
import { LiteralLexer } from './lexers/literal.lexer';
import { LogicalLexer } from './lexers/logical.lexer';
import { ProductionLexer } from './lexers/production.lexer';
import { WSNTokenizer } from './wsn.tokenizer';

@Frontend({
  name: 'Writh Syntax Notation',
  reference: 'wsn',
  extensions: ['wsn'],
  tokenizer: WSNTokenizer,
  lexers: [
    GrammarLexer,
    LiteralLexer,
    LogicalLexer,
    IdentifierLexer,
    ProductionLexer,
  ],
  interpreters: [
    SyntaxInterpreter,
    ProductionInterpreter,
    IdentifierInterpreter,
  ],
})
export class WSNFrontend implements IFrontend {}
