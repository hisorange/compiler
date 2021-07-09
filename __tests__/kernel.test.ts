import { TestKernel } from './helpers/test-kernel';

describe('Kernel', () => {
  test('should initialize', () => {
    expect(() => {
      new TestKernel();
    }).not.toThrow();
  });
});
