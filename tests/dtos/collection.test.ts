import { Collection } from '../../src/dtos/collection';

describe('Collection', () => {
  describe('.construct()', () => {
    test('should initialize without items', () => {
      const i = new Collection();

      expect(i.length).toBe(0);
    });
    test('should initialize with the given items', () => {
      const i = new Collection<string>(['a', 'b']);

      expect(i.length).toBe(2);
      expect(i.current).toBe('a');
      expect(i.next).toBe('b');
    });
  });

  describe('.push()', () => {
    test('should append new items', () => {
      const i = new Collection<string>(['a', 'b']);

      i.push('c');

      expect(i.length).toBe(3);
      expect(i.slice(2, 1)).toEqual(['c']);
    });
  });

  describe('.cursor', () => {
    test('should advance the cursor indepent to length', () => {
      const i = new Collection<number>([1, 2]);

      expect(i.cursor).toBe(0);
      i.consume();
      expect(i.cursor).toBe(1);
      i.advance();
      expect(i.cursor).toBe(2);
    });
  });

  describe('.isValid', () => {
    test('should be valid only if the cursor within range', () => {
      const i = new Collection([1, 2]);

      expect(i.isValid).toBe(true);
      i.consume();
      expect(i.isValid).toBe(true);
      i.consume();
      expect(i.isValid).toBe(false);
    });

    test('should never be valid for an empty collection', () => {
      const i = new Collection();

      expect(i.isValid).toBe(false);
    });
  });

  describe('.empty', () => {
    test('should be empty when no item in the collection', () => {
      const i = new Collection();

      expect(i.empty).toBe(true);
    });

    test('should not be empty when items in the collection', () => {
      const i = new Collection([null, 0]);

      expect(i.empty).toBe(false);
    });
  });

  describe('.current', () => {
    test('should return with the current item', () => {
      const i = new Collection([1, 2]);

      expect(i.current).toBe(1);
      i.consume();
      expect(i.current).toBe(2);
      i.consume();
      expect(i.current).toBe(undefined);
      i.push(3);
      expect(i.current).toBe(3);
    });
  });

  describe('.next', () => {
    test('should return with the next item without moving the cursor', () => {
      const i = new Collection([1, 2]);

      expect(i.next).toBe(2);
      i.consume();
      expect(i.next).toBe(undefined);
    });
  });

  describe('.prev', () => {
    test('should return with the previous item without moving the cursor', () => {
      const i = new Collection(['a', 'b']);

      expect(i.prev).toBe(undefined);
      i.consume();
      expect(i.cursor).toBe(1);
      expect(i.prev).toBe('a');
    });
  });

  describe('.advance()', () => {
    test('should advance the cursor with the given amount', () => {
      const i = new Collection();

      expect(i.cursor).toBe(0);
      i.advance();
      expect(i.cursor).toBe(1);
      i.advance(5);
      expect(i.cursor).toBe(6);
    });
  });

  describe('.length', () => {
    test('should track the items length in the collection', () => {
      const i = new Collection<string>(['1', '2']);

      expect(i.length).toBe(2);
      i.push('3');
      i.push('d');
      expect(i.length).toBe(4);
    });
  });

  describe('.consume()', () => {
    test('should consume the given amount ot items', () => {
      const i = new Collection([1, 2, 3]);

      expect(i.consume(1)).toEqual([1]);
      expect(i.consume(3)).toEqual([2, 3]);
      expect(i.cursor).toBe(4);
    });
  });

  describe('.slice', () => {
    test('should cut a slice from the items', () => {
      const i = new Collection([1, 2, 3]);

      expect(i.slice(1, 2)).toEqual([2, 3]);
    });
  });
});
