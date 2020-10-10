import { Bindings } from '../constants/bindings';
import { Events } from '../constants/events';
import { Timings } from '../constants/timings';
import { Inject } from '../decorators/inject.decorator';
import { Symbol } from '../dtos/symbol';
import { LoggerFactory } from '../factories/logger.factory';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { INode } from '../interfaces/dtos/node.interface';
import { ISymbol } from '../interfaces/dtos/symbol.interface';
import { IInterpreter } from '../interfaces/pipes/interpreter.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';
import { ISymbolTable } from '../interfaces/symbol-table.interface';

export class InterpreterPipe implements IPipe<INode, Promise<ISymbol>> {
  protected readonly logger: ILogger;

  public constructor(
    @Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory,
    @Inject(Bindings.Components.SymbolTable)
    protected readonly symbolTable: ISymbolTable,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly events: IEventEmitter,
    @Inject(Bindings.Collection.Interpreter)
    protected readonly interpreters: IInterpreter[],
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  public async pipe(node: INode): Promise<ISymbol> {
    this.logger.time(Timings.INTERPRETING);

    const symbol = new Symbol('ROOT');

    this.traverse(symbol, node);

    this.logger.info('Resolving the root symbol');

    symbol.register(this.symbolTable);
    symbol.resolve();

    this.logger.timeEnd(Timings.INTERPRETING);

    // Publish the result, here the subscribers can even optimize or change the nodes.
    this.events.publish(Events.INTERPRETED, {
      symbol,
      symbolTable: this.symbolTable,
    });

    return symbol;
  }

  protected traverse(symbol: ISymbol, node: INode) {
    const original = symbol;
    const interpreters = this.interpreters.filter(i =>
      i.interest().find(interest => node.type === interest),
    );

    for (const interepreter of interpreters) {
      symbol = interepreter.visit(symbol, node);

      this.logger.complete('Interpreted', {
        symbol: symbol.name.fqn,
      });
    }

    for (const child of node.getChildren()) {
      this.traverse(symbol, child);
    }

    return original;
  }
}
