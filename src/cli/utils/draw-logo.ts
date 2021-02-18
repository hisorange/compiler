import yargonaut from 'yargonaut';
import { drawLine } from './draw-line';

export function drawLogo() {
  const figlet = yargonaut.figlet();
  const color = yargonaut.chalk();

  // Draw the Artgen logo ^.^
  console.log(
    '\n',
    color.cyan(
      figlet.textSync('  Artgen << ', {
        font: 'ANSI Shadow',
        horizontalLayout: 'full',
        verticalLayout: 'default',
      }),
    ),
  );

  drawLine();
}
