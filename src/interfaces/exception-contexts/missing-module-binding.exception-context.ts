import { KernelModuleTypes } from '../../constants/modules';

export interface MissingModuleBindingExceptionContext {
  type: KernelModuleTypes;
  reference: string;
}
