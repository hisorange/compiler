import { Frontend, IFrontend } from '../../../components';
import { AMLInterpreters } from './aml.interpreters';
import { AMLLexers } from './aml.lexers';
import { AMLTokenizer } from './aml.tokenizer';

@Frontend({
  name: 'Application Markup Language',
  reference: 'aml',
  extensions: ['aml'],
  tokenizer: AMLTokenizer,
  interpreters: AMLInterpreters,
  lexers: AMLLexers,
})
export class AMLFrontend implements IFrontend {
  onInit() {}
}
