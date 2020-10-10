import { Path } from '../../src/dtos/path';

describe('Path', () => {
  test('should parse the input', () => {
    const path = new Path('/home/artgen/work/test.art');

    expect(path.baseName).toBe('test.art');
    expect(path.realPath).toBe('/home/artgen/work/test.art');
    expect(path.extension).toBe('art');
  });

  test('should normalize and parse the input', () => {
    const path = new Path('/home/artgen/work/../test.art');

    expect(path.baseName).toBe('test.art');
    expect(path.realPath).toBe('/home/artgen/test.art');
    expect(path.extension).toBe('art');
  });

  test('should not provide extension', () => {
    const path = new Path('/home/artgen/work/../test');

    expect(path.extension).toBe(undefined);
  });
});
