import { Character, CharacterLengthException, Path } from '../../src';

describe('Character', () => {
  describe('.construct()', () => {
    test('should initialize with position', () => {
      const path = new Path('test.art');
      const char = new Character('a', path, 1, 1, 1);

      expect(char.position.character).toBe(char);
      expect(char.position.line).toBe(1);
      expect(char.position.column).toBe(1);
      expect(char.code).toBe(97);
    });

    test('should throw when initialized with 2 character', () => {
      const path = new Path('test.art');

      expect(() => new Character('ab', path, 1, 1, 1)).toThrowError(
        CharacterLengthException,
      );
    });
  });

  describe('.prev()', () => {
    test('should create a linked list', () => {
      const path = new Path('test.art');
      const char = new Character('a', path, 10, 10, 1);
      const prev = new Character('b', path, 10, 9, 1);

      const prevNextMock = jest.fn();

      prev.next = prevNextMock;

      expect(char.prev()).toBe(undefined);
      char.prev(prev);

      expect(prevNextMock).toBeCalled();
      expect(prevNextMock).toHaveBeenCalledWith(char);
    });
  });

  describe('.next()', () => {
    test('should create a linked list', () => {
      const path = new Path('test.art');
      const char = new Character('a', path, 10, 10, 1);
      const next = new Character('b', path, 10, 9, 1);

      expect(char.next()).toBe(undefined);
      expect(char.next(next)).toBe(undefined);
      expect(char.next()).toBe(next);
    });
  });
});
