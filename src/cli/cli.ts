import {
  captureException,
  captureMessage,
  init as sentryInit,
  Severity,
} from '@sentry/node';
import { join } from 'path';
import yargonaut from 'yargonaut';
import yargs, { Argv } from 'yargs';
import { CompileCommand } from './commands/compile.program';
import { GenerateCommand } from './commands/generate.program';
import { IGlobalOptions } from './interfaces/global-options.inteface';
import { drawLine } from './utils/draw-line';
import { drawLogo } from './utils/draw-logo';

// Syntax shorthand for the program options.
type IProgram = Argv<IGlobalOptions>;

export class CLI {
  /**
   * Program's instance with the custom arguments.
   *
   * @protected
   * @type {IProgram}
   * @memberof CLI
   */
  protected readonly program: IProgram;

  /**
   * Creates an instance of CLI.
   *
   * @param {string[]} argv
   * @memberof CLI
   */
  constructor(readonly argv: string[]) {
    this.program = this.createProgram();
  }

  /**
   * Create the program instance, and load the global options to it.
   *
   * @protected
   * @returns {IProgram}
   * @memberof CLI
   */
  protected createProgram(): IProgram {
    const group = 'Globals:';

    return yargs(this.argv)
      .group(['help', 'version'], group)
      .option('verbosity', {
        alias: 'v',
        count: true,
        default: 4,
        choices: [1, 2, 3, 4],
        description: 'Logging verbosity',
        group,
      })
      .option('report', {
        boolean: true,
        default: true,
        description: 'Error report collection',
        group,
      })
      .option('color', {
        boolean: true,
        default: true,
        description: 'Colored output',
        group,
      })
      .option('logo', {
        boolean: true,
        default: true,
        description: 'Artgen ASCII art',
        group,
      });
  }

  /**
   * Accessor for the program's instance.
   *
   * @protected
   * @returns {IProgram}
   * @memberof CLI
   */
  protected getProgram(): IProgram {
    return this.program;
  }

  /**
   * Register the Artgen configurations and setup the details.
   *
   * @protected
   * @memberof CLI
   */
  protected fillDetails(): void {
    this.getProgram()
      .help('help')
      .alias('help', 'h')
      .epilog('For more information, visit us at https://artgen.io/')
      .scriptName('artgen')
      .version(this.getPackageVersion())
      .showHelpOnFail(true)
      .demandCommand(1, 'You need at least one command before moving on')
      .strict(true);
  }

  /**
   * Check the colors flag.
   *
   * @protected
   * @returns {boolean}
   * @memberof CLI
   */
  protected isColorsAllowed(): boolean {
    return this.getProgram().argv.color;
  }

  /**
   * Change the output to colorized.
   *
   * @protected
   * @memberof CLI
   */
  protected setColors(): void {
    if (this.isColorsAllowed()) {
      yargonaut.style('yellow');
      yargonaut.helpStyle('blue.underline');
      yargonaut.errorsStyle('red.bold.underline');
    }
  }

  /**
   * Register an event callback to the program fail hook,
   * and customize the error screen.
   *
   * @protected
   * @memberof CLI
   */
  protected setErrorHandler(): void {
    //this.getProgram().fail(this.onFail.bind(this));
  }

  /**
   * Handle the error messages.
   *
   * @protected
   * @param {string} message
   * @param {Error} trace
   * @param {IProgram} program
   * @returns {IProgram}
   * @memberof CLI
   */
  protected onFail(message: string, trace: Error, program: IProgram): IProgram {
    drawLogo();
    program.showHelp();
    drawLine();

    // Disclaimer!
    //
    // We are not collecting any information about the usage
    // or Your machine, this is only used to track errors
    // in production, to ease the work for bug fixing.
    //
    // You can opt out from this feature by passing the --no-report flag :(
    if (!this.argv.includes('--no-report')) {
      // Collect version information.
      sentryInit({
        dsn: 'https://1a55fa7452a34775814ee1219724a875@sentry.io/1823102',
        release: this.getPackageVersion(),
        args: this.argv,
      } as any);

      // Report the error message.
      captureMessage(message.replace(/\x1b\[[0-9;]*m/g, ''), Severity.Error);

      // Report the exception.
      if (trace) {
        captureException(trace);
      }
    }

    console.log('\n --->', message, '\n');

    return program;
  }

  /**
   * Read the package version from the published package.json
   *
   * @protected
   * @returns {string}
   * @memberof CLI
   */
  protected getPackageVersion(): string {
    return require(join(__dirname, '../../package.json')).version;
  }

  /**
   * Attach the commands to the program.
   *
   * @protected
   * @memberof CLI
   */
  protected registerCommands(): void {
    this.getProgram().command(new CompileCommand());
    this.getProgram().command(new GenerateCommand());
  }

  /**
   * Parse the input args and execute the commands.
   *
   * @protected
   * @memberof CLI
   */
  protected callExecution(): void {
    this.getProgram().parse(this.argv);
  }

  /**
   * Run the program.
   *
   * @returns {Argv<IGlobalOptions>}
   * @memberof CLI
   */
  public start(): IProgram {
    this.setColors();
    this.fillDetails();
    this.setErrorHandler();
    this.registerCommands();
    this.callExecution();

    return this.getProgram();
  }
}
