import { ClassDecoratorFactory } from '@loopback/metadata';
import { Constructor } from '../../container/interfaces/constructor.interface';
import { ITemplate } from '../interfaces/template.interface';

export interface IGeneratorMeta {
  name: string;
  reference: string;
  templates: Constructor<ITemplate>[];
  input: Object[];
  // <3
  author?: {
    name: string;
    email?: string;
    homepage?: string;
  };
}

export function Generator(spec: IGeneratorMeta): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<IGeneratorMeta>('artgen.generator', spec, {
    decoratorName: '@Generator',
  });
}
