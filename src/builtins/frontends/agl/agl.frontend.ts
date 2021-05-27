import { Frontend, IFrontend } from '../../../components';

@Frontend({
  name: 'Writh Syntax Notation',
  reference: 'wsn',
  extensions: ['wsn'],
  parsers: [],
  lexers: [],
  interpreters: [],
})
export class WSNFrontend implements IFrontend {
  onInit() {}
}
