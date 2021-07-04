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
    this.registerParser(['WS.EOL'], this.createParser_WS_EOL());
    this.registerParser(['WS.Tab'], this.createParser_WS_Tab());
    this.registerParser(['WS.Space'], this.createParser_WS_Space());
    this.registerParser(['WS.Set'], this.createParser_WS_Set());
    this.registerParser(['WS.Any', 'WS'], this.createParser_WS_Any());

    // Struct: ---
    this.registerParser(['Letter'], this.createParser_Letter());
    this.registerParser(['Digit'], this.createParser_Digit());
    this.registerParser(['Float'], this.createParser_Float());
    this.registerParser(['Number'], this.createParser_Number());
    this.registerParser(['Symbol'], this.createParser_Symbol());
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

  createParser_WS_Any() {
    const ref = 'WS.Any';
    const channel = 'WhiteSpace';

    const term_1 = this.nestParser('WS.Set');
    const parser = this.parseRepetitionNoneOrMore(ref, channel, term_1);

    return parser;
  }

  createParser_Letter() {
    const ref = 'Letter';
    const channel = 'Main';

    const parser = this.parseRange(ref, channel, 'a', 'Z');

    return parser;
  }

  createParser_Digit() {
    const ref = 'Digit';
    const channel = 'Main';

    const parser = this.parseRange(ref, channel, '0', '9');

    return parser;
  }

  createParser_Float() {
    const ref = 'Float';
    const channel = 'Main';

    const andGroup = [];

    andGroup.push(
      this.parseRepetitionOneOrMore(ref, channel, this.resolveParser('Digit')),
    );

    andGroup.push(this.parseLiteral(ref, channel, `.`));

    andGroup.push(
      this.parseRepetitionOneOrMore(ref, channel, this.resolveParser('Digit')),
    );

    const parser = this.parseLogicAnd(andGroup);

    return parser;
  }

  createParser_Number() {
    const ref = 'Number';
    const channel = 'Main';

    const orGroup = [];

    orGroup.push(this.resolveParser('Digit'));
    orGroup.push(this.resolveParser('Float'));

    const orParser = this.parseLogicOr(orGroup);
    const parser = this.wrapParser(ref, channel, orParser);

    return parser;
  }

  createParser_Symbol() {
    const ref = 'Symbol';
    const channel = 'Main';

    const orGroup = [];

    orGroup.push(this.resolveParser('Digit'));
    orGroup.push(this.resolveParser('Float'));
    orGroup.push(this.resolveParser('WS'));

    const orParser = this.parseLogicOr(orGroup);
    const parser = this.invertParser(ref, channel, orParser);

    return parser;
  }

  createParser_NumericRange() {
    const ref = 'NumericRange';
    const channel = 'Main';

    const andGroup = [];

    andGroup.push(
      this.parseRepetitionOneOrMore(
        'Digit',
        channel,
        this.resolveParser('Digit'),
      ),
    );
    andGroup.push(this.parseLiteral(ref, channel, `..`));
    andGroup.push(
      this.parseRepetitionOneOrMore(
        'Digit',
        channel,
        this.resolveParser('Digit'),
      ),
    );

    const andParser = this.parseLogicAnd(andGroup);
    const parser = this.wrapParser(ref, channel, andParser);

    return parser;
  }

  createParser_AlphabeticRange() {
    const ref = 'AlphabeticRange';
    const channel = 'Main';

    const andGroup = [];

    andGroup.push(this.resolveParser('Letter'));
    andGroup.push(this.parseLiteral(ref, channel, `..`));
    andGroup.push(this.resolveParser('Letter'));

    const andParser = this.parseLogicAnd(andGroup);
    const parser = this.wrapParser(ref, channel, andParser);

    return parser;
  }

  createParser_Boolean() {
    const ref = 'Boolean';
    const channel = 'Main';

    const orGroup = [];

    orGroup.push(this.parseLiteral(ref, channel, `true`));
    orGroup.push(this.parseLiteral(ref, channel, `false`));

    const parser = this.parseLogicOr(orGroup);

    return parser;
  }

  createParser_Range() {
    const ref = 'Range';
    const channel = 'Main';

    const orGroup = [];

    orGroup.push(this.resolveParser('NumericRange'));
    orGroup.push(this.resolveParser('AlphabeticRange'));

    const orParser = this.parseLogicOr(orGroup);
    const parser = this.wrapParser(ref, channel, orParser);

    return parser;
  }
}
