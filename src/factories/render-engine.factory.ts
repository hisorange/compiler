import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { IRenderEngine } from '../interfaces/components/render-engine.interface';
import { IContainer } from '../interfaces/container.interface';
import { IFactory } from '../interfaces/factory.interface';
import { IPluginConfig } from '../interfaces/plugin/plugin-config.interface';
import { IPlugin } from '../interfaces/plugin/plugin.interface';

export class RenderEngineFactory
  implements IFactory<IPlugin<IPluginConfig>, IRenderEngine> {
  public constructor(
    @Inject(Bindings.Container) protected readonly container: IContainer,
  ) {}

  create(plugin: IPlugin<IPluginConfig>): IRenderEngine {
    const renderer = this.container.getSync(Bindings.Components.RenderEngine);
    renderer.setScope(plugin.id);

    if (plugin.config.renderer) {
      renderer.inputBaseDirectory = plugin.config.renderer.views;
      renderer.outputBaseDirectory = plugin.config.renderer.output;
    }

    return renderer;
  }
}
