export interface IFactory<C, O> {
  create(config?: C): O;
}
