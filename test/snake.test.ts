import { describe, expect, it } from 'vitest';
import { SnakeNamingStrategy } from '../src/strategy/snake';

describe('SnakeNamingStrategy', () => {
  const strategy = new SnakeNamingStrategy();

  it('converts class name to snake_case table name', () => {
    expect(strategy.tableName('UserAccount', '')).toBe('user_account');
  });

  it('uses customName as-is for table name when provided', () => {
    expect(strategy.tableName('UserAccount', 'accounts')).toBe('accounts');
  });

  it('converts property name to snake_case column name', () => {
    expect(strategy.columnName('firstName', '', [])).toBe('first_name');
  });

  it('uses customName as-is for column name when provided', () => {
    expect(strategy.columnName('firstName', 'name', [])).toBe('name');
  });

  it('joins embeddedPrefixes with the property name before snake_casing', () => {
    expect(strategy.columnName('street', '', ['address'])).toBe(
      'address_street',
    );
  });

  it('converts relation property name to snake_case', () => {
    expect(strategy.relationName('userAccount')).toBe('user_account');
  });
});
