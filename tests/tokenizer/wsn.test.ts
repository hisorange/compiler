import {
  Character,
  Collection,
  ICharacter,
  Path,
  WSNTokenizer,
} from '../../src/';

export function createCharacters(input: string) {
  const characters = new Collection<ICharacter>();
  const path = new Path('test/input.txt');
  let lines = 0;
  let column = 0;

  input.split('').forEach((value, i) => {
    characters.push(new Character(value, path, lines, column++, i));

    if (value === '\n') {
      lines++;
      column = 0;
    }
  });

  return characters;
}

const loggerFactory: any = { create: () => console };

describe('WSN', () => {
  describe('Language', () => {
    const T = new WSNTokenizer(loggerFactory);

    T.prepare();

    test.each([
      [
        `SYNTAX     = { PRODUCTION } .`,
        `PRODUCTION = IDENTIFIER "=" EXPRESSION "." .`,
        `EXPRESSION = TERM { "|" TERM } .`,
        `TERM       = FACTOR { FACTOR } .`,
        `FACTOR     = IDENTIFIER`,
        `            | LITERAL`,
        `            | "[" EXPRESSION "]"`,
        `            | "(" EXPRESSION ")"`,
        `            | "{" EXPRESSION "}" .`,
        `IDENTIFIER = letter { letter } .`,
        //`LITERAL    = """" character { character } """" .`,
      ].join(' '),
    ])('should match full SYNTAX', input => {
      const characters = createCharacters(input);

      const parser = T.resolve('SYNTAX');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
    });

    test.each([
      `FieldBody = { "field" FieldName (FieldType) ";" } .`,
      'ID="b".',
      ' ID="b".',
      'ID="b" .',
      'ID="b". ',
      'ID ="b".',
      'ID   = "b".',
      'ID = "b".\n',
      `SYNTAX     = { PRODUCTION } .`,
      `PRODUCTION = IDENTIFIER "=" EXPRESSION "." .`,
      `EXPRESSION = TERM { "|" TERM } .`,
      `TERM       = FACTOR { FACTOR } .`,
      [
        `FACTOR     = IDENTIFIER`,
        `            | LITERAL`,
        `            | "[" EXPRESSION "]"`,
        `            | "(" EXPRESSION ")"`,
        `            | "{" EXPRESSION "}" .`,
      ].join('\n'),
      `IDENTIFIER = letter { letter } .`,
      //`LITERAL    = "'" character { character } "'" .`,
    ])('should match PRODUCTION (%s)', input => {
      const characters = createCharacters(input);

      const parser = T.resolve('PRODUCTION');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
    });

    test.each([`"a"`, `"1"`, `"="`, `";"`, `"'"`])(
      'should match LITERAL (%s)',
      input => {
        const characters = createCharacters(input);

        const parser = T.resolve('LITERAL');
        const match = parser(characters);

        expect(match.token).toBeDefined();
        expect(match.token.content).toBe(input);
      },
    );

    test.each([`\\`, `|`, `=`, `;`])('should match SYMBOL (%s)', input => {
      const characters = createCharacters(input);

      const parser = T.resolve('SYMBOL');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
    });

    test('should match LITERAL', () => {
      const characters = createCharacters(' "test"?/');
      expect(characters.cursor).toBe(0);
      characters.consume();
      expect(characters.cursor).toBe(1);

      const parser = T.resolve('LITERAL');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('"test"');
      expect(match.characters.cursor).toBe(7);
      expect(match.characters.current.value).toBe('?');
      expect(characters.cursor).toBe(1);
    });

    test('should match IDENTIFIER and stop at the special char', () => {
      const characters = createCharacters('test*');

      const parser = T.resolve('IDENTIFIER');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.type).toBe('IDENTIFIER');
      expect(match.token.content).toBe('test');
      expect(match.characters.cursor).toBe(4);
    });

    test('should match EXPRESSION as exp|"literal"|expr', () => {
      const characters = createCharacters('exp|"literal"|expr');

      const parser = T.resolve('EXPRESSION');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('exp|"literal"|expr');
      expect(match.characters.cursor).toBe(18);
    });

    const exprs: [string, number][] = Array.from(Array(9).keys()).map(
      length => {
        length++;
        return [
          Array.from(Array(length))
            .map(v => 'exp')
            .join('|'),
          length * 3 + length - 1,
        ];
      },
    );

    test.each(exprs)('should match EXPRESSION as (%s)', (input, expected) => {
      const characters = createCharacters(input);

      const parser = T.resolve('EXPRESSION');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
      expect(match.characters.cursor).toBe(expected);
      expect(match.characters.isValid).toBe(false);
    });

    test.each([
      'Identifier',
      `"Literal"`,
      `[Exp]`,
      `(Exp)`,
      `{"Exp"}`,
      `{eXp|Exp|"EXp"}`,
    ])('should match FACTOR (%s)', input => {
      const characters = createCharacters(input);

      const parser = T.resolve('FACTOR');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
      expect(match.characters.cursor).toBe(input.length);
      expect(match.characters.isValid).toBe(false);
    });

    test.each([`'Art'`, `"Gen"`])('should match LITERAL (%s)', input => {
      const characters = createCharacters(input);

      const parser = T.resolve('LITERAL');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
      expect(match.characters.cursor).toBe(input.length);
      expect(match.characters.isValid).toBe(false);
    });

    test.each(['test', 'Test', 'TesT', 'TEST_ME'])(
      'should match IDENTIFIER (%s)',
      input => {
        const characters = createCharacters(input);

        const parser = T.resolve('IDENTIFIER');
        const match = parser(characters);

        expect(match.token).toBeDefined();
        expect(match.token.type).toBe('IDENTIFIER');
        expect(match.token.content).toBe(input);
        expect(match.characters.cursor).toBe(input.length);
      },
    );
  });
});
