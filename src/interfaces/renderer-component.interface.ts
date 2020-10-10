export interface IRendererComponent {
  props?(): any;
  data(input): any;
  render(): any;
}
