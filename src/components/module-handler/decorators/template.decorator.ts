import { ClassDecoratorFactory } from '@loopback/metadata';
import { ReferenceResolver } from '../../container/forward-ref';
import { Constructor } from '../../container/interfaces/constructor.interface';
import { ITemplate } from '../interfaces/template.interface';

type RefTemplateDependency = ReferenceResolver<Constructor<ITemplate>>;
type TemplateDependency = Constructor<ITemplate> | RefTemplateDependency;

export interface ITemplateMeta {
  reference: string;
  path: string;
  template?: string;
  depends?: TemplateDependency[];
  engine?: {
    delimiter?: string;
  };
}

export function Template(spec: ITemplateMeta): ClassDecorator {
  return ClassDecoratorFactory.createDecorator<ITemplateMeta>(
    'artgen.template',
    spec,
    { decoratorName: '@Template' },
  );
}
