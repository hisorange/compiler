import {
  capitalize,
  humanize,
  pluralize,
  singularize,
  titleize,
} from 'inflection';
import { ISmartString } from './smart-string.interface';

import toStudlyCaps = require('strman.tostudlycaps');
import toSnakeCase = require('strman.tosnakecase');
import toCamelCase = require('strman.tocamelcase');
import toKebabCase = require('strman.tokebabcase');
import isUpperCase = require('strman.isuppercase');
import removeSpaces = require('strman.removespaces');

export class SmartString implements ISmartString {
  protected readonly subject: string;

  constructor(subject: string) {
    this.subject = subject.trim();
  }

  get singular(): ISmartString {
    return new SmartString(singularize(this.subject));
  }

  get plural(): ISmartString {
    return new SmartString(pluralize(this.subject));
  }

  get pascalCase(): ISmartString {
    return new SmartString(toStudlyCaps(this.normalize()));
  }

  get camelCase(): ISmartString {
    return new SmartString(toCamelCase(this.normalize()));
  }

  get kebabCase(): ISmartString {
    return new SmartString(toKebabCase(this.normalize()));
  }

  get snakeCase(): ISmartString {
    return new SmartString(toSnakeCase(this.normalize()));
  }

  get dotCase(): ISmartString {
    return new SmartString(this.normalize().replace(/_/g, '.'));
  }

  get humanCase(): ISmartString {
    return new SmartString(humanize(this.normalize()));
  }

  get titleCase(): ISmartString {
    return new SmartString(titleize(this.normalize()));
  }

  get upperCase(): ISmartString {
    return new SmartString(this.subject.toUpperCase());
  }

  get lowerCase(): ISmartString {
    return new SmartString(this.subject.toLowerCase());
  }

  get capitalCase(): ISmartString {
    return new SmartString(capitalize(this.subject));
  }

  get vacuumCase(): ISmartString {
    return new SmartString(removeSpaces(this.subject));
  }

  prefix(prefix: string | ISmartString): ISmartString {
    if (typeof prefix === 'string') {
      prefix = new SmartString(prefix);
    }

    return new SmartString(prefix.toString() + this.subject);
  }

  suffix(suffix: string | ISmartString): ISmartString {
    if (typeof suffix === 'string') {
      suffix = new SmartString(suffix);
    }

    return new SmartString(this.subject + suffix.toString());
  }

  toString(): string {
    return this.subject;
  }

  /**
   * Produce a snake case output built with only
   * lower case characters, this can be easily formated
   * by the used case transformators.
   *
   * @protected
   * @returns {string}
   * @memberof StringTransformer
   */
  protected normalize(): string {
    return toSnakeCase(
      isUpperCase(this.subject) ? this.subject.toLowerCase() : this.subject,
    ).toLowerCase();
  }
}
