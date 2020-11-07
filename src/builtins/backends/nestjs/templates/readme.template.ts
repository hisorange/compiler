import { ITemplate, Template } from '@artgen/kernel';
import { ISmartString } from '@artgen/smart-string';

@Template({
  reference: 'nestjs.readme',
  path: `readme.md`,
})
export class ReadMeTemplate implements ITemplate {
  data(input: { $name: ISmartString }) {
    return {
      input: {
        // Template data
      },
    };
  }

  render() {
    return `# Artgen - NestJS Project`;
  }
}
