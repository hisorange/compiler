import { IGeneratorInput } from './generator-input.interface';

export interface IGeneratorJob {
  reference: string;
  input: IGeneratorInput;
}
