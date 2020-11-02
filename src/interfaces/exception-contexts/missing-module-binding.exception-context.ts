import { ModuleType } from '../../module-handler/module.type';

export interface MissingModuleBindingExceptionContext {
  type: ModuleType;
  reference: string;
}
