import { IPluginConfig } from './plugin-config.interface';
import { IPluginInvoker } from './plugin-invoker.interface';

export interface IPlugin<T extends IPluginConfig> {
  /**
   * Unique plugin ID this will be used to refere to the plugin.
   *
   * @type {string}
   * @memberof IPlugin
   */
  readonly id: string;

  /**
   * Plugin config shared between then plugins.
   *
   * @type {Partial<T>}
   * @memberof IPlugin
   */
  readonly config: Partial<T>;

  /**
   * Invoke the plugin before Artgen start the execution,
   * here the plugins can register their injections throught the
   * container instance passed in the boostrapper and use
   * their own logger to communicate with the end user.
   *
   * Every plugin gets each other's plugin config instance to
   * allow communication and detection of other plugins.
   *
   * @param {IPluginInvoker} bootstraper
   * @memberof IPlugin
   */
  invoke(invoker: IPluginInvoker): void;
}
