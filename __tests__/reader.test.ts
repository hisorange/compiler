import { Bindings, Character, Collection, Path } from '../src';
import { Events } from '../src/components/event-handler/events';
import { ReadEvent } from '../src/components/event-handler/events/read.event';
import { FileNotFoundExcetion } from '../src/components/reader/exceptions/file-not-found.exception';
import { ReaderPipe } from '../src/components/reader/reader.pipe';
import { TestKernel } from './helpers/test.kernel';

describe('Reader', () => {
  const getPipe = (kernel: TestKernel): ReaderPipe =>
    kernel.getContainer().getSync(Bindings.Pipe.Reader);

  const createInput = (kernel: TestKernel, content: string) => {
    const fs = kernel.createFileSystem();
    fs.writeFileSync('/testf', content);
    kernel.mountInputFileSystem(fs);
  };

  test('should throw on invalid path', () => {
    const inst = getPipe(new TestKernel());
    expect(() => inst.pipe(new Path('/not-existing'))).rejects.toThrowError(
      FileNotFoundExcetion,
    );
  });

  test('should handle ASCII content', async () => {
    const kernel = new TestKernel();
    createInput(kernel, 'abc!');

    const inst = getPipe(kernel);
    const result = await inst.pipe(new Path('/testf'));

    expect(result).toBeInstanceOf(Collection);
    expect(result.length).toBe(4);
    expect(result.current).toBeInstanceOf(Character);
    expect(result.current.value).toBe('a');
    expect(result.next.value).toBe('b');
    expect(result.items[3].value).toBe('!');
  });

  test('should handle UTF-8 content', async () => {
    const kernel = new TestKernel();
    createInput(kernel, 'Áé');

    const inst = getPipe(kernel);
    const result = await inst.pipe(new Path('/testf'));

    expect(result.length).toBe(2);
    expect(result.current.value).toBe('Á');
    expect(result.next.value).toBe('é');
  });

  test('should handle binary content', async () => {
    const kernel = new TestKernel();
    const binary = Buffer.from(String.fromCharCode(2, 21, 35), 'binary');

    createInput(kernel, binary.toString());

    const inst = getPipe(kernel);
    const result = await inst.pipe(new Path('/testf'));

    expect(result.length).toBe(3);
    expect(result.current).toBeInstanceOf(Character);
    expect(result.current.code).toBe(2);
    expect(result.next.code).toBe(21);
    expect(result.items[2].code).toBe(35);
  });

  test('should assign line and column position', async () => {
    const kernel = new TestKernel();
    createInput(kernel, 'a\nb\ncd\n');

    const inst = getPipe(kernel);
    const result = await inst.pipe(new Path('/testf'));

    expect(result.length).toBe(7);
    expect(result.items[0].position.line).toBe(1);
    expect(result.items[1].position.line).toBe(1);
    expect(result.items[2].position.line).toBe(2);
    expect(result.items[3].position.line).toBe(2);

    expect(result.items[4].position.line).toBe(3);
    expect(result.items[4].position.column).toBe(1);

    expect(result.items[5].position.line).toBe(3);
    expect(result.items[5].position.column).toBe(2);

    expect(result.items[6].position.line).toBe(3);
  });

  test(`should emit an mutating [${Events.READ}] event`, async () => {
    const kernel = new TestKernel();
    createInput(kernel, 'a');

    const emitter = kernel.getEmitter();

    emitter.subscribe<ReadEvent>(Events.READ, data => {
      expect(data).toHaveProperty('characters');
      expect(data).toHaveProperty('path');
      expect(data.characters.length).toBe(1);

      // Mutate the outcome through the event.
      data.characters.push(new Character('b', data.path, 1, 2, 2));
    });

    await getPipe(kernel)
      .pipe(new Path('/testf'))
      .then(result => {
        expect(result.length).toBe(2);
      });
  }, 100);
});
