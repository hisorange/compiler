jest.mock('@sentry/node');

import {
  captureException,
  captureMessage,
  init as sentryInit,
} from '@sentry/node';
import { mocked } from 'ts-jest/utils';
import { CLI } from '../../src/cli/cli';

const mockSentryInit = mocked(sentryInit);
const mockCaptureException = mocked(captureException);
const mockCaptureMessage = mocked(captureMessage);

describe('CLI', () => {
  describe('Version Parsing', () => {
    test('Should parse the package version from the package.json', () => {
      expect(new CLI([])['getPackageVersion']()).toMatch(/\d+.\d+.\d+/);
    });
  });

  describe('Colorized Output', () => {
    test('Should check for --color flag when setting colors', () => {
      const cli = new CLI([]);
      const mock = (cli['isColorsAllowed'] = jest.fn());

      cli['setColors']();

      expect(mock).toHaveBeenCalled();
    });

    test('Should allow colors by default', () => {
      expect(new CLI([])['isColorsAllowed']()).toBe(true);
    });

    test('Should allow colors when the --color flag is present', () => {
      expect(new CLI(['--color'])['isColorsAllowed']()).toBe(true);
    });

    test('Should not allow colors when the --no-color flag is present', () => {
      expect(new CLI(['--no-color'])['isColorsAllowed']()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('Should call the error handler', () => {
      const instance = new CLI(['node', 'erroring', '--no-report']);
      const mock = (instance['onFail'] = jest.fn());
      instance['getProgram']().exitProcess(false);

      instance.start();

      expect(mock).toBeCalled();
    });

    test('Should display help on error', () => {
      const instance = new CLI(['node', 'help']);
      const program = instance['createProgram']();
      const err = null as any;
      const mock = (program['showHelp'] = jest.fn());

      global.console.log = mock;

      instance['onFail']('message', err, program);

      expect(mock).toBeCalled();
    });
  });

  describe('Error Reporting', () => {
    afterEach(() => {
      mockSentryInit.mockReset();
      mockCaptureException.mockReset();
      mockCaptureMessage.mockReset();
    });

    test('Should report the error message.', () => {
      const instance = new CLI(['fake-p', 'program']);
      const program = instance['createProgram']();
      const err = new Error('test');

      instance['onFail']('message', err, program);

      expect(mockSentryInit).toBeCalled();
      expect(mockCaptureException).toBeCalledWith(err);
      expect(mockCaptureMessage).toBeCalledWith('message', 'error');
    });

    test('Should not report the error message.', () => {
      const instance = new CLI(['--no-report']);

      instance['onFail']('message', new Error(), instance['getProgram']());

      expect(mockSentryInit).not.toBeCalled();
      expect(mockCaptureException).not.toBeCalled();
      expect(mockCaptureMessage).not.toBeCalled();
    });
  });

  describe('Execution Flow', () => {
    test('Should call execution on start', () => {
      const instance = new CLI([]);
      const mockCallExecution = (instance['callExecution'] = jest.fn());

      instance.start();

      expect(mockCallExecution).toBeCalled();
    });

    test('Should set the colors before execution', () => {
      const instance = new CLI([]);
      const mockSetColors = (instance['setColors'] = jest.fn());
      const mockCallExecution = (instance['callExecution'] = jest.fn());

      instance.start();

      expect(mockSetColors).toBeCalled();
      expect(mockCallExecution).toBeCalled();
    });

    test('Should fill details before execution', () => {
      const instance = new CLI([]);
      const mockFillDetails = (instance['fillDetails'] = jest.fn());
      const mockCallExecution = (instance['callExecution'] = jest.fn());

      instance.start();

      expect(mockFillDetails).toBeCalled();
      expect(mockCallExecution).toBeCalled();
    });

    test('Should register the error handler before execution', () => {
      const instance = new CLI([]);
      const mockSetErrorHandler = (instance['setErrorHandler'] = jest.fn());
      const mockCallExecution = (instance['callExecution'] = jest.fn());

      instance.start();

      expect(mockSetErrorHandler).toBeCalled();
      expect(mockCallExecution).toBeCalled();
    });

    test('Should register commands before execution', () => {
      const instance = new CLI([]);
      const mockRegisterCommands = (instance['registerCommands'] = jest.fn());
      const mockCallExecution = (instance['callExecution'] = jest.fn());

      instance.start();

      expect(mockRegisterCommands).toBeCalled();
      expect(mockCallExecution).toBeCalled();
    });

    test('Should return with the program', () => {
      const instance = new CLI([]);
      const originalProgram = instance['getProgram']();

      const mockParse = jest.fn();
      originalProgram['parse'] = mockParse;

      const mockGetProgram = (instance[
        'getProgram'
      ] = jest.fn().mockReturnValue(originalProgram));
      const mockSetColors = (instance['setColors'] = jest.fn());
      const mockFillDetails = (instance['fillDetails'] = jest.fn());
      const mockSetErrorHandler = (instance['setErrorHandler'] = jest.fn());
      const mockRegisterCommands = (instance['registerCommands'] = jest.fn());

      const program = instance.start();

      expect(mockSetColors).toBeCalled();
      expect(mockFillDetails).toBeCalled();
      expect(mockSetErrorHandler).toBeCalled();
      expect(mockRegisterCommands).toBeCalled();
      expect(mockGetProgram).toBeCalled();
      expect(program).toBe(originalProgram);
      expect(mockParse).toBeCalled();
    });
  });
});
