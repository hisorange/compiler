import * as engine from 'ejs';
import { Bindings, Inject } from '../../container';
import { IKernelModuleManager, ModuleType } from '../../module-handler';
import { IEngine } from '../interfaces/engine.interface';
const merge = require('deepmerge');

export class EJSEngine implements IEngine {
  /**
   * The EJS engine instance which executes the code view rendering.
   */
  protected readonly _engine: typeof engine;

  constructor(
    @Inject(Bindings.Module.Handler)
    protected readonly module: IKernelModuleManager,
  ) {
    this._engine = engine;
  }

  render(template: string, context: any, options?: Object): string {
    context.__FILE__ = '';
    context.__DIR__ = '';

    const baseOptions = {
      rmWhitespace: false,
      escape: i => i,
      delimiter: `%`,
      includer: (path: string, filename: string) => {
        const template = this.module.retrive(ModuleType.TEMPLATE, path);

        return {
          filename: path,
          template: template.module.render(),
        };
      },
    };

    if (options) {
      options = merge(baseOptions, options);
    } else {
      options = baseOptions;
    }

    return this._engine.render(template, context, options);
  }
}
