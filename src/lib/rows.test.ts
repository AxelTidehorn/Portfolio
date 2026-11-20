import assert from 'node:assert/strict';
import { test } from 'node:test';
import { toRows } from './rows.ts';

const P = { src: { width: 2, height: 3 } };
const L = { src: { width: 3, height: 2 } };

test('pairs consecutive portraits only', () => {
  assert.deepEqual(toRows([L, P, P, P, L]).map((r) => r.length), [1, 2, 1, 1]);
  assert.deepEqual(toRows([P]).map((r) => r.length), [1]);
  assert.deepEqual(toRows([]), []);
});
