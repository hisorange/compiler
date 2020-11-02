export interface IPipe<I, O> {
  /**
   * Pipe call for pipelining mechanism.
   *
   * @param {I} input
   * @returns {O}
   * @memberof IPipe
   */
  pipe(input: I): O;
}
