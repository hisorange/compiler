import { IPosition } from './position.interface';

export interface IRange {
  getRange(): IPosition[];
  getSize(): number;
}
