import { ClassDecoratorFactory } from '@loopback/metadata';
import { Constructor } from '../../container/interfaces/constructor.interface';
import { ITemplate } from '../interfaces/template.interface';

interface InputRecord {
  name: string;
  type: 'text';
  message: string;
  default?: string;
}

export interface IGeneratorMeta {
  name: string;
  reference: string;
  templates: Constructor<ITemplate>[];
  input: InputRecord[];
  // <3
  author?: {
    name: string;
    email?: string;
    homepage?: string;
  };
}

export function Generator(spec: IGeneratorMeta): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<IGeneratorMeta>(
    'artgen.generator',
    spec,
    {
      decoratorName: '@Generator',
    },
  );
}
