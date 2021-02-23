import { IParserExceptionContext, ParserException } from '..';
import chalk = require('chalk');

export async function drawParserException(
  exception: ParserException<IParserExceptionContext>,
) {
  const characters = exception.context.characters;
  let character = characters.current;

  if (exception.context.grammar.tokenizer.lastParserCharacter()) {
    const lastChar = exception.context.grammar.tokenizer.lastParserCharacter();

    if (characters.length > lastChar.position.index) {
      character = characters.slice(lastChar.position.index + 1, 1)[0];
    }
  }

  const chars = characters.slice(0, characters.length);
  const lines = new Map<number, string>();

  for (const char of chars) {
    const ln = char.position.line;

    if (!lines.has(ln)) {
      lines.set(ln, '');
    }

    lines.set(ln, lines.get(ln) + char.value);
  }

  const errLine = character.position.line;
  const errCol = character.position.column;

  const renderLineFrom = Math.max(errLine - 1, 0);
  const renderLineTo = Math.min(errLine + 1, lines.size);

  const separatorLine = chalk.magenta('-'.repeat(80));

  console.log('\r\n');
  console.log(
    chalk.underline('File') + ':',
    character.path.realPath + ':' + character.position.line + ':' + errCol,
  );
  console.log(separatorLine);
  console.log('\r\n');

  lines.forEach((line, index) => {
    if (index >= renderLineFrom && index <= renderLineTo) {
      if (index === errLine) {
        line =
          line.substr(0, errCol - 1) +
          chalk.bgRed.white(line.substr(errCol - 1, 1)) +
          line.substr(errCol, line.length - errCol);
      }
      console.log(line.trimRight());

      if (index === errLine) {
        console.log(
          ' '.repeat(Math.max(errCol - 2, 0)),
          chalk.red('^---'),
          chalk.yellow('Unexpected character'),
        );
      }
    }
  });

  console.log('\r\n', separatorLine);
}
