import { ModuleType } from '../module-type.enum';

export interface MissingModuleBindingExceptionContext {
  type: ModuleType;
  reference: string;
}
