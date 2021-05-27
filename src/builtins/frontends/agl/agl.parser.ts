import { IParser } from '../../../components';

const eolParser = (): IParser => createLiteralParser('\n');
const spaceParser = (): IParser => createLiteralParser(' ');
const tabParser = (): IParser => createLiteralParser('\t');
const wsParser = (): IParser =>
  createAnyParserLogic(
    createOrParserLogic([spaceParser, tabParser, eolParser]),
  );
