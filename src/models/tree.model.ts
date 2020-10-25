import { ITreeModel } from '../interfaces/tree.interface';

export abstract class TreeModel<T extends ITreeModel<T>> implements ITreeModel<T> {
  protected parent: T = null;
  protected children: T[] = [];

  isRoot(): boolean {
    return !!this.parent;
  }

  hasParent(): boolean {
    return this.parent !== null;
  }

  setParent(parent: T): this {
    this.parent = parent;

    // Add self if not added yet.
    if (!parent.getChildren().find(c => c === (this as any))) {
      parent.addChildren(this as any);
    }

    return this;
  }

  getParent(): T {
    return this.parent;
  }

  addChildren(...children: T[]): this {
    this.children.push(...children);

    children.forEach(c => ((c as any).parent = this));

    return this;
  }

  getChildren(): T[] {
    return this.children;
  }

  setChildren(...children: T[]): this {
    this.children = [];
    this.addChildren(...children);
    return this;
  }

  traverse(handler: (c: T) => void): void {
    this.getChildren().forEach(handler);
  }
}
