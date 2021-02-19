export interface ITemplate {
  props?(): Object;
  data(input): Object;
  render(): string;
}
