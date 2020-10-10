import { IPluginConfig } from './plugin-config.interface';
import { IPlugin } from './plugin.interface';

export interface IPluginManager {
  register(plugin: IPlugin<IPluginConfig>): void;

  invoke(): void;
}
