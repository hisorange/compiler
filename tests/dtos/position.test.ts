import { Position } from '../../src/dtos/position';
import { InvalidPositionException } from '../../src/exceptions/invalid-position.exception';

describe('Position', () => {
  test('should initialize and store the column and line values', () => {
    const position = new Position('a' as any, 10, 20, 1);

    expect(position.line).toBe(10);
    expect(position.column).toBe(20);
  });

  test('should throw on negative line position', () => {
    expect(() => new Position('a' as any, -5, 20, 1)).toThrowError(
      InvalidPositionException,
    );
  });

  test('should throw on negative column position', () => {
    expect(() => new Position('a' as any, 1, -20, 1)).toThrowError(
      InvalidPositionException,
    );
  });

  test('should allow zero as line position', () => {
    expect(() => new Position('a' as any, 0, 1, 1)).not.toThrow();
  });
  test('should allow zero as column position', () => {
    expect(() => new Position('a' as any, 1, 0, 1)).not.toThrow();
  });
});
