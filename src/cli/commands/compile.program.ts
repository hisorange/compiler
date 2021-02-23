import * as fs from 'fs';
import { dirname, join } from 'path';
import { Arguments, Argv, CommandModule } from 'yargs';
import {
  AMLFrontend,
  Kernel,
  ModuleType,
  ParserException,
  WSNFrontend,
} from '../../';
import { drawParserException } from '../exception.handler';
import { ICompileOptions } from '../interfaces/compile-options.interface';
import { IGlobalOptions } from '../interfaces/global-options.inteface';
import { drawLogo } from '../utils/draw-logo';
import { GitHandler } from '../utils/git-handler';

export class CompileCommand
  implements CommandModule<IGlobalOptions, ICompileOptions> {
  /**
   * Command grammar display in the CLI help.
   *
   * @type {string}
   * @memberof CompileCommand
   */
  readonly command: string = 'compile <input> [output]';

  /**
   * Alias to call the compile command.
   *
   * @type {string[]}
   * @memberof CompileCommand
   */
  readonly aliases: string[] = ['c'];

  /**
   * Command description shown on help texts.
   *
   * @type {string}
   * @memberof CompileCommand
   */
  readonly describe: string = 'Transpile input into output(s)';

  /**
   * @inheritdoc
   */
  async builder(program: Argv<IGlobalOptions>) {
    return program
      .positional('input', {
        normalize: true,
        type: 'string',
        describe: 'Input file or directory',
      })
      .positional('output', {
        default: '.',
        normalize: true,
        type: 'string',
        describe: 'Target output directory',
      })
      .default('output', '.')
      .boolean('git')
      .default('git', false)
      .boolean('dry-mode')
      .option('backend', {
        demandOption: true,
        type: 'array',
        choices: ['artgen.frontend', 'nestjs'],
        string: true,
      })
      .option('grammar', {
        demandOption: false,
        type: 'array',
        choices: ['wsn', 'aml'],
        string: true,
      })
      .example('compile', 'my-shop.aml . --backend moleculer --backend docker')
      .example('compile', 'sql.wsn my-sql-grammar --backend artgen.frontend')
      .example(
        'compile',
        'my-shop.sql my-shop.aml --backend negtra.sql --backend artgen.aml',
      )
      .default('dry-mode', false, 'Not writing the output to disk');
  }

  /**
   * @inheritdoc
   */
  async handler(args: Arguments<ICompileOptions>): Promise<void> {
    // Draw our awesome logo ^.^ ~ if allowed ~
    if (args.logo) {
      drawLogo();
    }

    const kernel = new Kernel();
    const logger = kernel.logger.scope('CLI');

    kernel.module.register(ModuleType.FRONTEND, AMLFrontend);
    kernel.module.register(ModuleType.FRONTEND, WSNFrontend);

    try {
      const cwd = process.cwd();
      const input = args.input[0] === '/' ? args.input : join(cwd, args.input);
      const output =
        args.output[0] === '/' ? args.output : join(cwd, args.output);

      kernel.mount(fs as any);

      const product = await kernel.compile(input, args.backend);
      let gitHandler;

      if (args.git) {
        gitHandler = GitHandler(logger.scope('Git'), output);
        await gitHandler.begin();
      }

      for (const [key, value] of Object.entries(product.toJSON())) {
        const file = join(output, key);
        const dir = dirname(file);

        if (!args['dry-mode']) {
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(file, value);
          // TODO: RUN PRETTIER HERE!
        }

        logger.info('PUT', file, (value as string).length);
      }

      if (args.git) {
        await gitHandler.complete();
      }

      logger.info('Finished', {
        input,
        output,
        verbosity: args.verbosity,
        dryMode: args['dry-mode'],
      });
    } catch (e) {
      if (e instanceof ParserException) {
        logger.error(`An error occured while parsed the input: ${e.message}`);

        await drawParserException(e);
      } else {
        console.error('Unhandler exception!');
        console.error(e);
      }
    }
  }
}
