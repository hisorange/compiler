import { BaseParser, Grammar } from '../../../components';
import { IFragmentParserSchema } from '../../../components/parser/interfaces/fragment-parser-schema.interface';

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
    this.registerParser(this.createParser_WS_EOL());
  }

  createParser_WS_EOL(): IFragmentParserSchema {
    const orGroup = [];
    orGroup.push(this.parseLiteral(`\n`));
    orGroup.push(this.parseLiteral(`\r\n`));

    return {
      references: ['WS.EOL'],
      isOptional: false,
      channel: 'WhiteSpace',
      matcher: this.parseLogicOr(orGroup),
    };
  }

  createParser_WS_Tab(ref: string, channel: string) {
    return this.parseLiteral(`\t`);
  }

  createParser_WS_Space(ref: string, channel: string) {
    return this.parseLiteral(` `);
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

    andGroup.push(this.parseLiteral(`.`));

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
    andGroup.push(this.parseLiteral(`..`));
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
    andGroup.push(this.parseLiteral(`..`));
    andGroup.push(this.resolveParser('Letter'));

    const andParser = this.parseLogicAnd(andGroup);

    return this.wrapParser(ref, channel, andParser);
  }

  createParser_Boolean(ref: string, channel: string) {
    const orGroup = [];

    orGroup.push(this.parseLiteral(`true`));
    orGroup.push(this.parseLiteral(`false`));

    return this.wrapParser(ref, channel, this.parseLogicOr(orGroup));
  }

  createParser_Range(ref: string, channel: string) {
    const orGroup = [];

    orGroup.push(this.resolveParser('NumericRange'));
    orGroup.push(this.resolveParser('AlphabeticRange'));

    const orParser = this.parseLogicOr(orGroup);

    return this.wrapParser(ref, channel, orParser);
  }
}
