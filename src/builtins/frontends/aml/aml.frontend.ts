import { Frontend, IFrontend } from '../../../components';
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
