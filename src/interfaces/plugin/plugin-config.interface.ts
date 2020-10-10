import { Language } from '../../constants/language';

export interface IPluginConfig {
  /**
   *
   * @type {{
   *     output: string;
   *     views: string;
   *   }}
   * @memberof IPluginConfig
   */
  renderer?: {
    output?: string;
    views?: string;
  };
  languages?: Language[];
}
