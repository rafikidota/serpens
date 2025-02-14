import { DefaultNamingStrategy } from 'typeorm';
import { NamingStrategyInterface } from 'typeorm';
import { snakeCase } from '../util/snake-case';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName: string): string {
    return customName || snakeCase(className);
  }
  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return snakeCase(
      embeddedPrefixes.concat(customName || propertyName).join('_'),
    );
  }
  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}
