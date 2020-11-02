import { Bindings } from '../container/bindings';
import { Inject } from '../container/decorators/inject.decorator';
import { Events } from '../event-handler/events';
import { IEventEmitter } from '../event-handler/interfaces/event-emitter.interface';
import { Timings } from '../event-handler/timings';
import { ILogger } from '../logger/interfaces/logger.interface';
import { LoggerFactory } from '../logger/logger.factory';
import { INode } from '../models/interfaces/node.interface';
import { IToken } from '../models/interfaces/token.interface';
import { Node } from '../models/node';
import { ILexer } from './interfaces/lexer.interface';
import { IPipe } from './interfaces/pipe.interface';

export class LexerPipe implements IPipe<IToken, Promise<INode>> {
  protected readonly logger: ILogger;

  public constructor(
    @Inject(Bindings.Factory.Logger) loggerFactory: LoggerFactory,
    @Inject(Bindings.Components.EventEmitter)
    protected readonly events: IEventEmitter,
    @Inject(Bindings.Collection.Lexer)
    protected readonly lexers: ILexer[],
  ) {
    // Create a new logger.
    this.logger = loggerFactory.create({
      label: [this.constructor.name],
    });
  }

  public async pipe(token: IToken): Promise<INode> {
    this.logger.time(Timings.LEXING);

    let ctx: INode = new Node('ROOT');

    ctx = await this.visit(ctx, token);

    while (ctx.hasParent()) {
      ctx = ctx.getParent();
    }

    this.logger.timeEnd(Timings.LEXING);

    // Publish the result, here the subscribers can even optimize or change the nodes.
    this.events.publish(Events.LEXED, ctx);

    return ctx;
  }

  protected async visit(ctx: INode, token: IToken): Promise<INode> {
    // Find related lexers for the current context.
    const lexers = this.lexers.filter(v => v.interest().find(i => i === token.type));

    if (lexers.length) {
      this.logger.info('Lexing', {
        on: 'enter',
        context: ctx.type,
        token: token.type,
        lexers: lexers.length,
      });

      for (const lexer of lexers) {
        ctx = lexer.enter(ctx, token);
      }
    }

    for (const child of token.getChildren()) {
      ctx = await this.visit(ctx, child);
    }

    if (lexers.length) {
      this.logger.info('Lexing', {
        on: 'exit',
        context: ctx.type,
        token: token.type,
        lexers: lexers.length,
      });

      for (const lexer of lexers) {
        ctx = lexer.exit(ctx, token);
      }
    }

    return ctx;
  }
}
