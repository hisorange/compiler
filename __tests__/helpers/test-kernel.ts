import { IKernelConfig, Kernel, KernelMode } from '../../src';

export class TestKernel extends Kernel {
  constructor(
    config: IKernelConfig = {
      mode: KernelMode.TESTING,
    },
  ) {
    super(config);
  }
}
