import { IKernelConfig, Kernel, KernelEnvironment } from '../../src';

export class TestKernel extends Kernel {
  constructor(
    config: IKernelConfig = {
      environment: KernelEnvironment.TESTING,
    },
  ) {
    super(config);
  }
}
