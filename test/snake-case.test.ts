import { describe, expect, it } from 'vitest';
import { snakeCase } from '../src/util/snake-case';

describe('snakeCase', () => {
  it('leaves an already snake_case string unchanged', () => {
    expect(snakeCase('foo_bar')).toBe('foo_bar');
  });

  it('converts camelCase to snake_case', () => {
    expect(snakeCase('fooBar')).toBe('foo_bar');
  });

  it('converts PascalCase to snake_case', () => {
    expect(snakeCase('FooBar')).toBe('foo_bar');
  });

  it('handles consecutive acronym letters correctly', () => {
    expect(snakeCase('APIKey')).toBe('api_key');
  });
});
