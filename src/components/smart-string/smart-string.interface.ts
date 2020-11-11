export interface ISmartString {
  /**
   * Singular form of the subject.
   */
  readonly singular: ISmartString;

  /**
   * Plural form of the subject.
   */
  readonly plural: ISmartString;

  /**
   * Pascal case: MyProperty
   */
  readonly pascalCase: ISmartString;

  /**
   * Camel case: myProperty
   */
  readonly camelCase: ISmartString;

  /**
   * Kebab case: my-property
   */
  readonly kebabCase: ISmartString;

  /**
   * Snake case: my_property
   */
  readonly snakeCase: ISmartString;

  /**
   * Snake case: my.property
   */
  readonly dotCase: ISmartString;

  /**
   * Human case: My property
   */
  readonly humanCase: ISmartString;

  /**
   * Title case: My Property
   */
  readonly titleCase: ISmartString;

  /**
   * Upper case: MY PROPERTY
   */
  readonly upperCase: ISmartString;

  /**
   * Lower case: my property
   */
  readonly lowerCase: ISmartString;

  /**
   * Capital case: My property
   */
  readonly capitalCase: ISmartString;

  /**
   * RemoveInnerSpaces.
   */
  readonly vacuumCase: ISmartString;

  /**
   * Concatanate with the given string.
   *
   * @param subject
   */
  prefix(subject: string | ISmartString): ISmartString;

  /**
   * Concatanate with the given string.
   *
   * @param subject
   */
  suffix(subject: string | ISmartString): ISmartString;
}
