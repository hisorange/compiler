import { IGlobalOptions } from './global-options.inteface';

export interface ICompileOptions extends IGlobalOptions {
  input: string;
  output: string;
  git: boolean;
  backend: string[];
  grammar: string[];
  'dry-mode': boolean;
}
