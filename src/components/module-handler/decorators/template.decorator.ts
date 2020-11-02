import { ClassDecoratorFactory } from '@loopback/metadata';
import { Constructor } from '../../container/interfaces/constructor.interface';
import { ITemplate } from '../interfaces/template.interface';

export interface ITemplateMeta {
  reference: string;
  path: string;
  template?: string;
  depends?: Constructor<ITemplate>[];
  engine?: {
    delimiter?: string;
  };
}

export function Template(spec: ITemplateMeta): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<ITemplateMeta>('artgen.template', spec, { decoratorName: '@Template' });
}
