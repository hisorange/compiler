import { ClassDecoratorFactory } from '@loopback/metadata';
import { Constructor } from '../../container/interfaces/constructor.interface';
import { ITemplate } from '../interfaces/template.interface';

interface InputRecord<K> {
  name: K;
  type: 'text';
  message: string;
  default?: string;
}

export interface IGeneratorMeta<I> {
  name: string;
  reference: string;
  templates: Constructor<ITemplate>[];
  input: InputRecord<keyof I>[];
  // <3
  author?: {
    name: string;
    email?: string;
    homepage?: string;
  };
}

export function Generator<I>(spec: IGeneratorMeta<I>): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<IGeneratorMeta<I>>(
    'artgen.generator',
    spec,
    {
      decoratorName: '@Generator',
    },
  );
}
