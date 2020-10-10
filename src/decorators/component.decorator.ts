import { ClassDecoratorFactory } from '@loopback/metadata';
import { Constructor } from '../interfaces/constructor.interface';
import { IRendererComponent } from '../interfaces/renderer-component.interface';

export enum COMPONENT_RENDERER {
  EJS = 'ejs',
}

export interface ComponentMetaData {
  reference: string;
  path: string;
  template?: string;
  depends?: Constructor<IRendererComponent>[];
  renderer?: {
    engine?: COMPONENT_RENDERER;
    delimiter?: string;
  };
}

export function Component(spec: ComponentMetaData): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<ComponentMetaData>(
    'artgen.component',
    spec,
    { decoratorName: '@Component' },
  );
}
