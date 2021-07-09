import {
  IEventEmitter,
  IKernelConfig,
  Kernel,
  KernelEnvironment,
  ModuleType,
} from '../../src';
import { Bindings } from '../../src/components/container/bindings';
import { ArTestGenerator } from './artest.generator';

export class TestKernel extends Kernel {
  constructor(
    config: IKernelConfig = {
      environment: KernelEnvironment.TESTING,
    },
  ) {
    super(config);
  }

  registerTestGenerator() {
    this.getContainer()
      .getSync(Bindings.Module.Handler)
      .register(ModuleType.GENERATOR, ArTestGenerator);
  }

  getEmitter(): IEventEmitter {
    return this.getContainer().getSync(Bindings.Components.EventEmitter);
  }
}
