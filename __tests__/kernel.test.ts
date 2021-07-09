import { Signale } from 'signale';
import { FileSystem, KernelEnvironment } from '../src';
import { Bindings } from '../src/components/container/bindings';
import { Container } from '../src/components/container/container';
import { TestKernel } from './helpers/test.kernel';

describe('Kernel', () => {
  describe('Initialization', () => {
    test('should initialize', () => {
      expect(() => {
        new TestKernel();
      }).not.toThrow();
    });

    test('should store the config', () => {
      const kernel = new TestKernel();

      expect(kernel['config']).toHaveProperty('environment');
      expect(kernel['config'].environment).toBe(KernelEnvironment.TESTING);
    });
  });

  describe('Dependency handling', () => {
    test('should create and prepare the kernel level container', () => {
      const kernel = new TestKernel();
      const ctx = kernel.getContainer();

      expect(ctx).toBeInstanceOf(Container);
      expect(ctx.name).toBe('kernel');
      expect(ctx.contains(Bindings.Config)).toBe(true);
    });
  });

  describe('Public API', () => {
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
});
