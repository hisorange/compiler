export interface ITemplate {
  props?(): any;
  data(input): any;
  render(): any;
}
