import { BaseParser, Grammar } from '../../../components';

@Grammar({
  name: 'agl',
  extensions: ['agl'],
  version: '1.0',
})
export class GrammarParser extends BaseParser {
  register(): void {
    this.registerChannels();
    this.registerParsers();
  }

  getContextPrefix(): string {
    return 'agl';
  }

  registerChannels(): void {
    this.registerChannel('Main');
    this.registerChannel('Syntax');
    this.registerChannel('Operator');
    this.registerChannel('Comment');
    this.registerChannel('WhiteSpace');
  }

  registerParsers(): void {
    // Struct: WS
    this.registerParser('WS.EOL', this.createParser_WS_EOL());
    this.registerParser('WS.Tab', this.createParser_WS_Tab());
    this.registerParser('WS.Space', this.createParser_WS_Space());
    this.registerParser('WS.Set', this.createParser_WS_Set());
  }

  createParser_WS_EOL() {
    const ref = 'WS.EOL';
    const channel = 'WhiteSpace';

    const orGroup = [];
    orGroup.push(this.parseLiteral(ref, channel, `\n`));
    orGroup.push(this.parseLiteral(ref, channel, `\r\n`));

    const parser = this.parseLogicOr(orGroup);

    return parser;
  }

  createParser_WS_Tab() {
    const ref = 'WS.Tab';
    const channel = 'WhiteSpace';

    const parser = this.parseLiteral(ref, channel, `\t`);

    return parser;
  }

  createParser_WS_Space() {
    const ref = 'WS.Space';
    const channel = 'WhiteSpace';

    const parser = this.parseLiteral(ref, channel, ` `);

    return parser;
  }

  createParser_WS_Set() {
    const ref = 'WS.Set';
    const channel = 'WhiteSpace';

    const orGroup = [];
    orGroup.push(this.nestParser('WS.EOL'));
    orGroup.push(this.nestParser('WS.Space'));
    orGroup.push(this.nestParser('WS.Tab'));

    const orParser = this.parseLogicOr(orGroup);
    const parser = this.wrapParser(ref, channel, orParser);

    return parser;
  }
}
