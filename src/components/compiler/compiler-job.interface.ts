import { IPath } from '../models/interfaces/path.interface';

export interface ICompilerJob {
  input: IPath;
  backendRefs: string[];
}
