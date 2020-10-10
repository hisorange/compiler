import { ClassDecoratorFactory } from '@loopback/metadata';
import { Constructor } from '../interfaces/constructor.interface';
import { IRendererComponent } from '../interfaces/renderer-component.interface';

export interface IBackendMeta {
  name: string;
  reference: string;
  // depends?: Constructor<IGenerator>[],
  components?: Constructor<IRendererComponent>[];
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
