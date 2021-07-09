export interface ITemplate {
  context?(input): Object;
  render(): string;
}
