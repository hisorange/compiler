import { Grammar } from '../components/grammar';
import { Bindings } from '../constants/bindings';
import { Inject } from '../decorators/inject.decorator';
import { IContainer } from '../interfaces/container.interface';
import { IFactory } from '../interfaces/factory.interface';

export class GrammarFactory
  implements IFactory<{ id: string; extension: string }, Grammar> {
  public constructor(
    @Inject(Bindings.Container) protected readonly container: IContainer,
  ) {}

  create({ id, extension }) {
    const tokenizer = this.container.getSync(Bindings.Components.Tokenizer);

    return new Grammar(id, tokenizer, extension);
  }
}
