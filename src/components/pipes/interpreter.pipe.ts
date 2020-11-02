import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { Events } from '../event-handler/events';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { Timings } from '../event-handler/timings';
import { ISymbolTable } from '../iml/interfaces/symbol-table.interface';
import { ISymbol } from '../iml/interfaces/symbol.interface';
import { Symbol } from '../iml/symbol';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { INode } from '../models/interfaces/node.interface';
import { IInterpreter } from './interfaces/interpreter.interface';
import { IPipe } from './interfaces/pipe.interface';

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
    const interpreters = this.interpreters.filter(i => i.interest().find(interest => node.type === interest));

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
