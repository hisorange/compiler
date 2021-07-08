import { IFragmentParser } from './fragment-parser.interface';

export interface IFragmentParserSchema {
  references: string[];
  channel: string;
  isOptional: boolean;
  matcher: IFragmentParser;
}
