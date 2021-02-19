import * as fs from 'fs';
import * as inquirer from 'inquirer';
import { dirname, join } from 'path';
import { Arguments, Argv, CommandModule } from 'yargs';
import { Kernel } from '../../';
import { IGeneratorOptions } from '../interfaces/generator-options.interface';
import { IGlobalOptions } from '../interfaces/global-options.inteface';
import { drawLogo } from '../utils/draw-logo';

export class GenerateCommand implements CommandModule<IGlobalOptions, IGeneratorOptions> {
  /**
   * @type {string}
   * @memberof CompileCommand
   */
  readonly command: string = 'generate [generator]';

  /**
   * @type {string[]}
   * @memberof CompileCommand
   */
  readonly aliases: string[] = ['g'];

  /**
   * Command description shown on help texts.
   *
   * @type {string}
   * @memberof CompileCommand
   */
  readonly describe: string = 'Generate the template in the current directory';

  /**
   * @inheritdoc
   */
  async builder(program: Argv<IGlobalOptions>) {
    return program
      .positional('generator', {
        normalize: true,
        type: 'string',
        describe: `Generator's name`,
        default: '$PROMPT',
        demandOption: false,
      })
      .boolean('dry-mode')
      .example('generate', 'laravel.module')
      .example('generate', 'nestjs.service')
      .default('dry-mode', false, 'Not writing the output to disk');
  }

  /**
   * @inheritdoc
   */
  async handler(args: Arguments<IGeneratorOptions>): Promise<void> {
    // Draw our awesome logo ^.^ ~ if allowed ~
    if (args.logo) {
      drawLogo();
    }

    const kernel = new Kernel();
    const logger = kernel.logger.scope('CLI');

    try {
      kernel.mount(fs as any);

      const cwd = process.cwd();
      let input = questions => inquirer.createPromptModule()(questions);

      if (fs.existsSync(join(cwd, '.artgenrc'))) {
        const use = await inquirer.createPromptModule()({
          type: 'confirm',
          message: 'Found an .artgenrc use it for regenerate?',
          name: 'useRc',
          default: true,
        });

        if (use.useRc) {
          const config = JSON.parse(fs.readFileSync(join(cwd, '.artgenrc')).toString());
          args.generator = config.reference;
          input = config.input;
        }
      }

      if (args.generator === '$PROMPT') {
        const res = await inquirer.createPromptModule()({
          type: 'list',
          message: 'Which generator You wana use?',
          name: 'gen',
          choices: ['artgen.template', 'artgen.frontend', 'artgen.backend', 'nestjs.crud'],
        });

        args.generator = res.gen;
      }

      const product = await kernel.generate(args.generator as string, input);

      for (const [key, value] of Object.entries(product.toJSON())) {
        const file = key;
        const dir = dirname(file);

        if (!args['dry-mode']) {
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(file, value);
        } else {
          logger.info('PUT', file, (value as string).length);
        }
      }

      logger.info('Finished', {
        verbosity: args.verbosity,
        dryMode: args['dry-mode'],
      });
    } catch (e) {
      logger.error(`An error occured: ${e.message}`);
      console.error(e);
    }
  }
}
