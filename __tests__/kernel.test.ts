import { Kernel } from '../src';

describe('Kernel', () => {
  test('should initialize the dependency contianer', () => {
    const kernel = new Kernel();

    expect(1).toBe(1);
  });
});
