import { ModuleType } from '../src';
import { Bindings } from '../src/components/container/bindings';
import { ArTestGenerator } from './helpers/test-generator';
import { TestKernel } from './helpers/test-kernel';

describe('Generator', () => {
  describe('Support', () => {
    test('should the kernel register the module', () => {
      const kernel = new TestKernel();
      kernel.registerTestGenerator();

      const moduleHandler = kernel
        .getContainer()
        .getSync(Bindings.Module.Handler);

      const record = moduleHandler.retrive(
        ModuleType.GENERATOR,
        'artest.generator',
      );

      expect(record).toHaveProperty('meta');
      expect(record).toHaveProperty('module');

      expect(record.meta.reference).toBe('artest.generator');
      expect(record.module).toBeInstanceOf(ArTestGenerator);
    });

    test('should have dependency injection', () => {
      const kernel = new TestKernel();
      kernel.registerTestGenerator();

      const moduleHandler = kernel
        .getContainer()
        .getSync(Bindings.Module.Handler);

      const record = moduleHandler.retrive(
        ModuleType.GENERATOR,
        'artest.generator',
      );

      const inst = record.module as ArTestGenerator;

      expect(inst.kernel).toBe(kernel);
    });
  });

  describe('Kernel Call', () => {
    test('should generate the test file', async () => {
      const kernel = new TestKernel();
      kernel.registerTestGenerator();

      const result = await kernel.generate(
        {
          name: 'Ar Test',
          baseDirectory: '/artest/',
        },
        'artest.generator',
      );

      const rc = '/artest/.artgenrc';
      const path = '/artest/templates/ar-test.txt';
      const content = 'Should print ArTestTemplate=ArTestTemplate';

      expect(result.existsSync(rc)).toBe(true);
      expect(result.existsSync(path)).toBe(true);
      expect(result.readFileSync(path).toString()).toBe(content);
    });
  });
});
