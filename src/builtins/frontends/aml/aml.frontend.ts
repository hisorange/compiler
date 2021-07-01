import { Frontend, IFrontend } from '../../../components';
import { AMLParser } from './aml.tokenizer';

@Frontend({
  name: 'Aml',
  reference: 'artgen.aml',
  extensions: ['aml'],
  tokenizer: AMLParser,
  lexers: [],
  interpreters: [],
})
export class AMLFrontend implements IFrontend {
  onInit() {}
}
