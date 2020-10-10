export interface ITreeModel<T> {
  /**
   * Check if it's a root.
   *
   * @returns {boolean}
   * @memberof ITree<T>
   */
  isRoot(): boolean;

  /**
   * Check if it's a root.
   *
   * @returns {boolean}
   * @memberof ITree<T>
   */
  hasParent(): boolean;

  /**
   * Change the parent node.
   *
   * @param {T} parent
   * @returns {this} Self
   * @memberof ITree<T>
   */
  setParent(parent: T): this;

  /**
   * Get the parent node.
   *
   * @returns {T} Parent
   * @memberof ITree<T>
   */
  getParent(): T;

  /**
   * Add new child(ren) to the node.
   *
   * @param {...T[]} children
   * @returns {this} Self
   * @memberof ITree<T>
   */
  addChildren(...children: T[]): this;

  /**
   * Overide the children stack.
   *
   * @param {...T[]} children
   * @returns {this} Self
   * @memberof ITree<T>
   */
  setChildren(...children: T[]): this;

  /**
   * Get the child nodes.
   *
   * @returns {T[]}
   * @memberof ITree<T>
   */
  getChildren(): T[];

  /**
   * Traverse the node tree downward.
   *
   * @returns {void}
   * @memberof ITree<T>
   */
  traverse(handler: (c: T) => void): void;
}
