import { Language } from '../../constants/language';
import { IPluginConfig } from '../../interfaces/plugin/plugin-config.interface';
import { IPluginInvoker } from '../../interfaces/plugin/plugin-invoker.interface';
import { IPlugin } from '../../interfaces/plugin/plugin.interface';
import { BridgeRenderer } from './bridge.renderer';
import { IdentifierInterpreter } from './interpreters/identifier.interpreter';
import { ProductionInterpreter } from './interpreters/production.interpreter';
import { SyntaxInterpreter } from './interpreters/syntax.interpreter';
import { GrammarLexer } from './lexers/grammar.lexer';
import { IdentifierLexer } from './lexers/identifier.lexer';
import { LiteralLexer } from './lexers/literal.lexer';
import { LogicalLexer } from './lexers/logical.lexer';
import { ProductionLexer } from './lexers/production.lexer';
import { createParsers } from './wsn.grammar';

/*
@Grammar({
  name: 'WSN',
  extensions: ['wsn'],
  // parsers: [],
  // lexers: [],
  // interpreters: [],
})
*/
export class WSNPlugin implements IPlugin<IPluginConfig> {
  /**
   * @inheritdoc
   */
  readonly id = 'WSN';

  /**
   * @inheritdoc
   */
  readonly config: IPluginConfig = {
    renderer: {
      output: '/',
      views: '.',
    },
    languages: [Language.WSN],
  };

  /**
   * @inheritdoc
   */
  invoke(invoker: IPluginInvoker): void {
    const { logger, collections, grammarFactory, renderEngine } = invoker;

    // Grammar
    const grammar = grammarFactory.create({ id: 'WSN', extension: 'wsn' });
    createParsers(grammar.tokenizer);
    collections.grammars.push(grammar);

    // Lexing
    collections.lexers.push(
      ...[
        new GrammarLexer(),
        new LiteralLexer(),
        new LogicalLexer(),
        new IdentifierLexer(),
        new ProductionLexer(),
      ],
    );

    // Interpreter
    collections.interpreters.push(
      ...[
        new SyntaxInterpreter(),
        new ProductionInterpreter(),
        new IdentifierInterpreter(),
      ],
    );

    collections.renderers.push(new BridgeRenderer(renderEngine));
  }
}
