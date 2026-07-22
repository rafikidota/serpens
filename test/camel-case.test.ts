import { describe, expect, it } from 'vitest';
import { camelCase } from '../src/util/camel-case';

describe('camelCase', () => {
  it('leaves an already camelCase string unchanged', () => {
    expect(camelCase('fooBar')).toBe('fooBar');
  });

  it('converts snake_case to camelCase', () => {
    expect(camelCase('foo_bar')).toBe('fooBar');
  });

  it('converts kebab-case to camelCase', () => {
    expect(camelCase('foo-bar')).toBe('fooBar');
  });

  it('converts space separated words to camelCase', () => {
    expect(camelCase('foo bar')).toBe('fooBar');
  });

  it('capitalizes the first letter when firstCapital is true', () => {
    expect(camelCase('foo_bar', true)).toBe('FooBar');
  });
});
