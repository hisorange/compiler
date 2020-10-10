import { Constructor } from './constructor.interface';
import { INode } from './dtos/node.interface';

export interface IDescriptor<N> {
  /**
   * Keyword which can define the symbol
   *
   * @example "application", "domain", "field"
   *
   * @returns {string}
   * @memberof IDescriptor
   */
  getKeyword(): string;

  /**
   * Symbol node which instance will be used to define the symbol.
   *
   * @returns {Constructor<N>}
   * @memberof IDescriptor
   */
  getProduct(): Constructor<N>;

  /**
   * Nodes where the symbol can be defined.
   *
   * @example [RootNode, ModuleSymbolNode]
   *
   * @returns {Constructor<INode>[]}
   * @memberof IDescriptor
   */
  getAllowedHosts(): Constructor<INode>[];
}
