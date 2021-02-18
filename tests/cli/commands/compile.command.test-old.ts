jest.mock('../../../src/cli/utils/draw-logo');

describe('CompileCommand', () => {
  /*
  test('Should invoke compile with input and output', () => {
    const cli = new CLI(['compile', 'INPUT', 'OUTPUT']);
    const cmd = new CompileCommand();
    const mBuilder = (cmd.builder = jest.fn());

    // Replace the command with the mocked instance.
    cli['registerCommands'] = () => {
      cli['getProgram']().command(cmd);
    };

    cli.start();

    expect(mBuilder).toBeCalled();
  });

  test('Should invoke compile with input only', () => {
    const cli = new CLI(['compile', 'INPUT']);
    const cmd = new CompileCommand();
    const sBuilder = jest.spyOn(cmd, 'builder');

    // Replace the command with the mocked instance.
    cli['registerCommands'] = () => {
      cli['getProgram']().command(cmd);
    };

    cli.start();

    expect(sBuilder).toBeCalled();
  });

  /*
  describe('Logo', () => {
    afterEach(() => jest.resetAllMocks());

    test('Should draw logo', () => {
      const cli = new CLI(['compile', 'INPUT']);
      const mDrawLogo = mocked(drawLogo, true);

      cli.start();

      expect(mDrawLogo).toBeCalled();
    });

    test('Should not draw logo with --no-logo flag', () => {
      const cli = new CLI(['compile', 'INPUT', '--no-logo']);
      const mDrawLogo = mocked(drawLogo, true);

      cli.start();

      expect(mDrawLogo).not.toBeCalled();
    });
  });
  */
});
