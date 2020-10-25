import { Bindings } from '../constants/bindings';
import { Events } from '../constants/events';
import { Timings } from '../constants/timings';
import { Inject } from '../decorators/inject.decorator';
import { Node } from '../dtos/node';
import { LoggerFactory } from '../factories/logger.factory';
import { IEventEmitter } from '../interfaces/components/event-emitter.interface';
import { ILogger } from '../interfaces/components/logger.interface';
import { INode } from '../interfaces/dtos/node.interface';
import { IToken } from '../interfaces/dtos/token.interface';
import { ILexer } from '../interfaces/pipes/lexer.interface';
import { IPipe } from '../interfaces/pipes/pipe.interface';

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
