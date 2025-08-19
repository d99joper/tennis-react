import { helpers } from './helpers';

describe('truncate', () => {
  test('handles undefined text', () => {
    expect(helpers.truncate(undefined, 5)).toBe('');
  });

  test('truncates long text', () => {
    expect(helpers.truncate('abcdef', 5)).toBe('abcde...');
  });

  test('returns original text when shorter than limit', () => {
    expect(helpers.truncate('abc', 5)).toBe('abc');
  });
});
