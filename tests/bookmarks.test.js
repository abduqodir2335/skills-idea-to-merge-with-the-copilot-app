import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBookmark, normalizeUrl, parseBookmarks } from '../src/lib/bookmarks.js';

test('normalizes URLs with and without https to the same value', () => {
  assert.equal(normalizeUrl('example.com/path'), 'https://example.com/path');
  assert.equal(normalizeUrl('https://example.com/path'), 'https://example.com/path');
  assert.equal(normalizeUrl('example.com/path'), normalizeUrl('https://example.com/path'));
});

test('recovers from empty, corrupted, legacy, and non-array storage values', () => {
  for (const value of ['', null, '{not json', '"legacy bookmark"', '{"url":"https://example.com"}', '42']) {
    assert.doesNotThrow(() => parseBookmarks(value));
    assert.deepEqual(parseBookmarks(value), []);
  }
});

test('drops malformed entries from stored arrays', () => {
  const stored = JSON.stringify([
    { url: 'https://example.com', slug: 'mona-7fk2' },
    { url: 'javascript:alert(1)', slug: 'mona-aaaa' },
    { url: 'https://example.org', slug: 'invalid' },
    null,
  ]);
  assert.deepEqual(parseBookmarks(stored), [
    { url: 'https://example.com/', slug: 'mona-7fk2' },
  ]);
});

test('formats a saved bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
