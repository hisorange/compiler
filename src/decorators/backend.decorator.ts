import { ClassDecoratorFactory } from '@loopback/metadata';
import { Constructor } from '../interfaces/constructor.interface';
import { ITemplate } from '../interfaces/template.interface';

export interface IBackendMeta {
  name: string;
  reference: string;
  templates?: Constructor<ITemplate>[];
  input?: Object;
  // <3
  author?: {
    name: string;
    email?: string;
    homepage?: string;
  };
}

export function Backend(spec: IBackendMeta): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<IBackendMeta>(
    'artgen.backend',
    spec,
    { decoratorName: '@Backend' },
  );
}
