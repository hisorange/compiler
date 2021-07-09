import { Signale } from 'signale';
import { FileSystem } from '../src';
import { Bindings } from '../src/components/container/bindings';
import { Container } from '../src/components/container/container';
import { TestKernel } from './helpers/test-kernel';

describe('Kernel', () => {
  test('should initialize', () => {
    expect(() => {
      new TestKernel();
    }).not.toThrow();
  });

  test('should create the kernel level container', () => {
    const kernel = new TestKernel();
    const ctx = kernel.getContainer();

    expect(ctx).toBeInstanceOf(Container);
    expect(ctx.name).toBe('kernel');
  });

  test('should create a new file system', () => {
    const kernel = new TestKernel();
    const fs = kernel.createFileSystem();

    expect(fs).toBeInstanceOf(FileSystem);
  });

  test('should create a logger', () => {
    const kernel = new TestKernel();
    const logger = kernel.createLogger('Test');

    expect(logger).toBeInstanceOf(Signale);
  });

  test('should mount input file system', () => {
    const kernel = new TestKernel();
    const fs = kernel.createFileSystem();
    kernel.mountInputFileSystem(fs);

    const inputFS = kernel
      .getContainer()
      .getSync(Bindings.Provider.InputFileSystem);

    expect(inputFS).toBe(fs);
  });
});
