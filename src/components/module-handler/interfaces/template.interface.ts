export interface ITemplate {
  data?(input): Object;
  render(): string;
}
