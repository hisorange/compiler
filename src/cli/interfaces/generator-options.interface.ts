import { IGlobalOptions } from './global-options.inteface';

export interface IGeneratorOptions extends IGlobalOptions {
  generator: string;
  'dry-mode': boolean;
}
