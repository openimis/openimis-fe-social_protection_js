import { describe, expect, it } from 'vitest';

import isJsonString from './json-validate';

describe('isJsonString', () => {
  it.each([
    ['an object', '{"type":"object"}'],
    ['an array', '[1,2]'],
    ['a quoted string', '"text"'],
    ['a number', '42'],
    ['null', 'null'],
  ])('accepts %s', (_label, value) => {
    expect(isJsonString(value)).toBe(true);
  });

  it.each([
    ['a truncated object', '{"type":'],
    ['a bare word', 'text'],
    ['single quotes', "{'type':'object'}"],
    ['a trailing comma', '{"a":1,}'],
    ['nothing at all', ''],
    ['only whitespace', '   '],
    ['undefined', undefined],
  ])('rejects %s', (_label, value) => {
    expect(isJsonString(value)).toBe(false);
  });

  // JSON.parse coerces its argument, so non-strings are accepted.
  it.each([
    ['a number', 42],
    ['null', null],
  ])('accepts %s by coercing it to a string first', (_label, value) => {
    expect(isJsonString(value)).toBe(true);
  });
});
