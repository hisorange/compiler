const extender = require('deepmerge');
const { isPlainObject } = require('is-plain-object');

export class RenderContext<P extends Object = {}> {
  protected _props: P;
  protected _parent: RenderContext<any> | null = null;

  constructor(init?: Object, parent?: RenderContext) {
    if (typeof init === 'object') {
      this.extend(init);
    }

    if (parent) {
      this._parent = parent;
    }
  }

  extend(extension: RenderContext | Object): this {
    if (extension instanceof RenderContext) {
      extension = extension.props();
    }

    this._props = extender(this._props, extension, {
      isMergeableObject: isPlainObject,
    });

    return this;
  }

  fork(): RenderContext {
    return new RenderContext(this._props, this);
  }

  discard(): RenderContext {
    if (!this._parent) {
      throw new Error('Cannot discard context without parent!');
    }

    return this._parent;
  }

  swap(ctx: RenderContext): void {
    this._props = ctx.props() as any;
  }

  props(): P {
    return this._props;
  }
}
