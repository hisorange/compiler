import { Character, Collection, ICharacter, Path, Tokenizer } from '../../src/';

class TokenizerTestImpl extends Tokenizer {
  prepare(): void {}
}

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

describe('Parsers', () => {
  describe('.resolve', () => {
    test('should resolve reference', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const input = 'ab';
      const characters = createCharacters(input);

      const A = T.literal('a');
      const B = T.literal('b');
      const AB = T.concat([A, B]);

      const parser = AB;
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
      expect(match.characters.cursor).toBe(input.length);
    });
  });

  describe('.alias', () => {
    test('should alias reference', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const input = 'ab';
      const characters = createCharacters(input);

      T.identifier('A', T.literal('a'));
      T.identifier('B', T.literal('b'));
      const AB = T.identifier('AB', T.or([T.alias('A'), T.alias('B')]));

      const parser = AB;
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.type).toBe('AB');
      expect(match.token.getChildren().length).toBe(1);
      expect(match.token.getChildren()[0].type).toBe('A');
    });
  });

  describe('.concat', () => {
    test('should match nested second reference', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const input = 'ab'.repeat(2) + 'c';
      const characters = createCharacters(input);

      const A = T.literal('a');
      const B = T.literal('b');
      const AB = T.concat([A, B]);

      const parser = T.concat([AB, AB, T.literal('c')]);
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
      expect(match.characters.cursor).toBe(input.length);
    });
  });

  describe('.or', () => {
    test.each([
      ['abc', 'a'],
      ['bac', 'b'],
      ['cab', 'c'],
    ])('Should match a parser on (%s)', (input, expected) => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters(input);

      const parser = T.identifier(
        input,
        T.or([T.literal('a'), T.literal('b'), T.literal('c')]),
      );
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.type).toBe(input);
      expect(match.token.content).toBe(expected);
      expect(match.characters.cursor).toBe(1);
    });

    test('should match the third parser', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('cab');

      const parser = T.or([T.literal('a'), T.literal('b'), T.literal('c')]);
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('c');
      expect(match.characters.cursor).toBe(1);
    });

    test('should match nested second reference', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const input = 'a'.repeat(8);
      const characters = createCharacters(input);

      const A = T.literal('a');
      const A2 = T.concat([A, A]);
      const A3 = T.concat([A2, A]);
      const A9 = T.concat([A3, A3, A3]);
      const A8 = T.concat([A3, A3, A2]);

      const parser = T.or([A9, A8, A]);
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
      expect(match.characters.cursor).toBe(input.length);
    });
  });

  describe('.repetition', () => {
    test.each([
      ['cab', 'a'],
      ['caab', 'aa'],
      ['caaab', 'aaa'],
    ])('Should match every repetition on (%s)', (input, expected) => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters(input);
      characters.advance(1);

      expect(characters.cursor).toBe(1);
      expect(characters.current.value).toBe('a');

      const parser = T.repetition(T.literal('a'));
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(expected);
      expect(match.characters.cursor).toBe(1 + expected.length);
      expect(match.characters.current.value).toBe('b');
    });

    test('should match multiple characters', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('abc1');

      expect(characters.cursor).toBe(0);

      const parser = T.repetition(T.regexp(/[a-z]/));
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('abc');
      expect(match.characters.cursor).toBe(3);
    });

    test('should not match any on wrong start', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('2abc1');

      expect(characters.cursor).toBe(0);

      const parser = T.repetition(T.regexp(/[a-z]/));
      const match = parser(characters);

      expect(match.token).not.toBeDefined();
      expect(match.characters.cursor).toBe(0);
    });

    test('should match multiple reference', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('abcdefgh1');

      const ALPHA = T.regexp(/[a-z]/);

      expect(characters.cursor).toBe(0);

      const parser = T.repetition(ALPHA);
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('abcdefgh');
      expect(match.characters.cursor).toBe(8);
    });

    test('should match multiple nested reference', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('abcdefgh123');

      const ALPHANUM = T.or([T.regexp(/[a-z]/), T.regexp(/[0-9]/)]);

      expect(characters.cursor).toBe(0);

      const parser = T.repetition(ALPHANUM);
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('abcdefgh123');
      expect(match.characters.cursor).toBe(11);
    });

    test('should match multiple deep nested reference', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const input = 'a'.repeat(8 * 9);
      const characters = createCharacters(input);

      const A = T.literal('a');
      const AAA = T.concat([A, A, A]);
      const A9 = T.concat([AAA, AAA, AAA]);

      expect(characters.cursor).toBe(0);

      const parser = T.repetition(A9);
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe(input);
      expect(match.characters.cursor).toBe(input.length);
    });
  });

  describe('.regexp', () => {
    test('should match the first character', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('abc');

      expect(characters.cursor).toBe(0);

      const parser = T.regexp(/a/);
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('a');
      expect(match.characters.cursor).toBe(1);
    });

    test('should not match the second character', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('abc');

      expect(characters.cursor).toBe(0);

      const parser = T.regexp(/b/);
      const match = parser(characters);

      expect(match.token).not.toBeDefined();
      expect(match.characters.cursor).toBe(0);
    });
  });

  describe('.literal', () => {
    test('should match a single character', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('abc');

      const parser = T.literal('a');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('a');
      expect(match.characters.cursor).toBe(1);
    });

    test('should not match the second character', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('abc');
      expect(characters.cursor).toBe(0);

      const parser = T.literal('b');
      const match = parser(characters);

      expect(match.token).not.toBeDefined();
      expect(match.characters.cursor).toBe(0);
    });

    test('should match a two character', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('abc');

      const parser = T.literal('ab');
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('ab');
      expect(match.characters.cursor).toBe(2);
    });

    test.each([`\\`, `|`, `=`, `;`, ` `])(
      'should match literal (%s)',
      input => {
        const T = new TokenizerTestImpl(loggerFactory);
        const characters = createCharacters(input);

        const parser = T.literal(input);
        const match = parser(characters);

        expect(match.token).toBeDefined();
        expect(match.token.content).toBe(input);
      },
    );
  });

  describe('.opt', () => {
    test('should match with optional ws', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('a b');

      const parser = T.concat([
        T.literal('a'),
        T.optional(T.literal(' ')),
        T.literal('b'),
      ]);
      const match = parser(characters);

      expect(match.token).toBeDefined();
      expect(match.token.content).toBe('a b');
      expect(match.characters.cursor).toBe(3);
    });

    test('should not match the second character', () => {
      const T = new TokenizerTestImpl(loggerFactory);
      const characters = createCharacters('abc');
      expect(characters.cursor).toBe(0);

      const parser = T.literal('b');
      const match = parser(characters);

      expect(match.token).not.toBeDefined();
      expect(match.characters.cursor).toBe(0);
    });
  });
});
