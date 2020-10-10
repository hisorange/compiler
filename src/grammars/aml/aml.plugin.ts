import { Language } from '../../constants/language';
import { IPluginConfig } from '../../interfaces/plugin/plugin-config.interface';
import { IPluginInvoker } from '../../interfaces/plugin/plugin-invoker.interface';
import { IPlugin } from '../../interfaces/plugin/plugin.interface';
import { AMLInterpreters } from './aml.interpreters';
import { AMLLexers } from './aml.lexers';
import { createTokenizer } from './aml.tokenizer';

export class AMLPlugin implements IPlugin<IPluginConfig> {
  /**
   * @inheritdoc
   */
  readonly id = ' AML';

  /**
   * @inheritdoc
   */
  readonly config: IPluginConfig = {
    languages: [Language.AML],
  };

  /**
   * @inheritdoc
   */
  invoke(invoker: IPluginInvoker): void {
    const { logger, collections, grammarFactory } = invoker;
    const grammar = grammarFactory.create({ id: 'AML', extension: 'aml' });

    createTokenizer(grammar.tokenizer);

    collections.grammars.push(grammar);
    collections.lexers.push(...AMLLexers);
    collections.interpreters.push(...AMLInterpreters);
  }
}
