export interface IResult<T> {
  /**
   * Indicator if the process was successful or not.
   *
   * @type {boolean}
   * @memberof IResult
   */
  readonly success: boolean;

  /**
   * Product created with the result.
   *
   * @type {T}
   * @memberof IResult
   */
  readonly product?: T;
}
