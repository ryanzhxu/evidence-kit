import { test } from 'node:test';
import assert from 'node:assert';
import { createClaim, validateClaim, isActionable, BASES } from '../src/claim.js';

test('valid claim passes validation', () => {
  const c = createClaim({ value: 'x', basis: 'fact', confidence: 1 });
  assert.equal(validateClaim(c).length, 0);
  assert.ok(BASES.includes(c.basis));
});
test('bad basis rejected', () => {
  assert.ok(validateClaim({ value: 'x', basis: 'guess', confidence: 1, sources: [] }).length > 0);
});
test('confidence range enforced', () => {
  assert.throws(() => createClaim({ value: 'x', basis: 'fact', confidence: 2 }));
});
test('isActionable: grounded + confident only', () => {
  assert.equal(isActionable({ basis: 'fact', confidence: 0.8 }), true);
  assert.equal(isActionable({ basis: 'hypothesis', confidence: 0.9 }), false);
  assert.equal(isActionable({ basis: 'user-confirmed', confidence: 0.5 }), false);
});
