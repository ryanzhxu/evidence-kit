// Evidence-Kit — a graded claim primitive.
// Separates fact / user-confirmed / inferred / hypothesis, with confidence + sources,
// so decision-support UIs can show WHY something is believed and invite correction.

export const BASES = ['fact', 'user-confirmed', 'inferred', 'hypothesis'];

export function validateClaim(claim) {
  const errors = [];
  if (claim == null || typeof claim !== 'object') return ['claim must be an object'];
  if (claim.value === undefined || claim.value === null) errors.push('value is required');
  if (!BASES.includes(claim.basis)) errors.push('basis must be one of ' + BASES.join('|'));
  if (typeof claim.confidence !== 'number' || Number.isNaN(claim.confidence) || claim.confidence < 0 || claim.confidence > 1)
    errors.push('confidence must be a number in [0,1]');
  if (claim.sources !== undefined && !Array.isArray(claim.sources)) errors.push('sources must be an array');
  return errors;
}

export function createClaim({ value, basis, confidence, sources = [], note = '' }) {
  const claim = { value, basis, confidence, sources, note };
  const errors = validateClaim(claim);
  if (errors.length) throw new Error('Invalid claim: ' + errors.join('; '));
  return claim;
}

// A claim is safe to act on only when grounded AND confident.
export function isActionable(claim, minConfidence = 0.7) {
  return (claim.basis === 'fact' || claim.basis === 'user-confirmed') && claim.confidence >= minConfidence;
}
