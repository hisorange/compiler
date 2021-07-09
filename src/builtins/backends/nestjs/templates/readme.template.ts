import { ITemplate, Template } from '../../../../components';
import { ISmartString } from '../../../../components/smart-string';

@Template({
  reference: 'nestjs.readme',
  path: `readme.md`,
})
export class ReadMeTemplate implements ITemplate {
  context(input: { $name: ISmartString }) {
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
