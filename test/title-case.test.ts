import { describe, expect, it } from 'vitest';
import { titleCase } from '../src/util/title-case';

describe('titleCase', () => {
  it('capitalizes each word and lowercases the rest', () => {
    expect(titleCase('foo bar')).toBe('Foo Bar');
  });

  it('normalizes an all-uppercase string', () => {
    expect(titleCase('FOO BAR')).toBe('Foo Bar');
  });

  it('leaves an already title-cased string unchanged', () => {
    expect(titleCase('Foo Bar')).toBe('Foo Bar');
  });
});
