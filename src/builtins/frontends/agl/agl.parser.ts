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
    this.createStruct_WS();
  }

  protected createStruct_WS() {
    const channel = 'WhiteSpace';

    this.registerParser(
      ['WS.EOL'],
      this.createParser_WS_EOL('WS.EOL', channel),
    );

    this.registerParser(
      ['WS.Tab'],
      this.createParser_WS_Tab('WS.Tab', channel),
    );

    this.registerParser(
      ['WS.Space'],
      this.createParser_WS_Space('WS.Space', channel),
    );

    this.registerParser(
      ['WS.Set'],
      this.createParser_WS_Set('WS.Set', channel),
    );

    this.registerParser(
      ['WS.Any', 'WS'],
      this.createParser_WS_Any('WS.Any', channel),
    );
  }

  createParser_WS_EOL(ref: string, channel: string) {
    const orGroup = [];
    orGroup.push(this.parseLiteral(ref, channel, `\n`));
    orGroup.push(this.parseLiteral(ref, channel, `\r\n`));

    return this.parseLogicOr(orGroup);
  }

  createParser_WS_Tab(ref: string, channel: string) {
    return this.parseLiteral(ref, channel, `\t`);
  }

  createParser_WS_Space(ref: string, channel: string) {
    return this.parseLiteral(ref, channel, ` `);
  }

  createParser_WS_Set(ref: string, channel: string) {
    const orGroup = [];
    orGroup.push(this.nestParser('WS.EOL'));
    orGroup.push(this.nestParser('WS.Space'));
    orGroup.push(this.nestParser('WS.Tab'));

    const orParser = this.parseLogicOr(orGroup);
    const parser = this.wrapParser(ref, channel, orParser);

    return parser;
  }

  createParser_WS_Any(ref: string, channel: string) {
    return this.parseRepetitionNoneOrMore(
      ref,
      channel,
      this.nestParser('WS.Set'),
    );
  }

  createParser_Letter(ref: string, channel: string) {
    return this.parseRange(ref, channel, 'a', 'Z');
  }

  createParser_Digit(ref: string, channel: string) {
    return this.parseRange(ref, channel, '0', '9');
  }

  createParser_Float(ref: string, channel: string) {
    const andGroup = [];

    andGroup.push(
      this.parseRepetitionOneOrMore(ref, channel, this.resolveParser('Digit')),
    );

    andGroup.push(this.parseLiteral(ref, channel, `.`));

    andGroup.push(
      this.parseRepetitionOneOrMore(ref, channel, this.resolveParser('Digit')),
    );

    return this.parseLogicAnd(andGroup);
  }

  createParser_Number(ref: string, channel: string) {
    const orGroup = [];

    orGroup.push(this.resolveParser('Digit'));
    orGroup.push(this.resolveParser('Float'));

    const orParser = this.parseLogicOr(orGroup);

    return this.wrapParser(ref, channel, orParser);
  }

  createParser_Symbol(ref: string, channel: string) {
    const orGroup = [];

    orGroup.push(this.resolveParser('Digit'));
    orGroup.push(this.resolveParser('Float'));
    orGroup.push(this.resolveParser('WS'));

    const orParser = this.parseLogicOr(orGroup);

    return this.invertParser(ref, channel, orParser);
  }

  createParser_NumericRange(ref: string, channel: string) {
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

    return this.wrapParser(ref, channel, andParser);
  }

  createParser_AlphabeticRange(ref: string, channel: string) {
    const andGroup = [];

    andGroup.push(this.resolveParser('Letter'));
    andGroup.push(this.parseLiteral(ref, channel, `..`));
    andGroup.push(this.resolveParser('Letter'));

    const andParser = this.parseLogicAnd(andGroup);

    return this.wrapParser(ref, channel, andParser);
  }

  createParser_Boolean(ref: string, channel: string) {
    const orGroup = [];

    orGroup.push(this.parseLiteral(ref, channel, `true`));
    orGroup.push(this.parseLiteral(ref, channel, `false`));

    return this.parseLogicOr(orGroup);
  }

  createParser_Range(ref: string, channel: string) {
    const orGroup = [];

    orGroup.push(this.resolveParser('NumericRange'));
    orGroup.push(this.resolveParser('AlphabeticRange'));

    const orParser = this.parseLogicOr(orGroup);

    return this.wrapParser(ref, channel, orParser);
  }
}
