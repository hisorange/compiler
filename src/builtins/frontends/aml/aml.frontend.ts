import { Frontend, IFrontend } from '../../../components';
import { AMLLexers } from './aml.lexers';
import { AMLTokenizer } from './aml.tokenizer';

@Frontend({
  name: 'Aml',
  reference: 'artgen.aml',
  extensions: ['aml'],
  tokenizer: AMLTokenizer,
  lexers: [],
  interpreters: [],
})
export class AMLFrontend implements IFrontend {
  onInit() {}
}
