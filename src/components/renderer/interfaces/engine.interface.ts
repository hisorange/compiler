export interface IEngine {
  /**
   * Render the template with the given context.
   */
  render(template: string, context: Object, options: Object): string;

  /**
   * Check for extensions.
   */
  //isExtensionSupported(extension: string): boolean;
}
