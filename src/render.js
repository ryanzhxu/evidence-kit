import { validateClaim } from './claim.js';

const LABEL = { 'fact': 'Fact', 'user-confirmed': 'Confirmed', 'inferred': 'Inferred', 'hypothesis': 'Hypothesis' };

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Returns an HTML string for one graded claim. Framework-agnostic.
export function renderClaim(claim, opts = {}) {
  const errs = validateClaim(claim);
  if (errs.length) return `<div class="ek-claim ek-error">Invalid claim: ${esc(errs.join('; '))}</div>`;
  const pct = Math.round(claim.confidence * 100);
  const sources = (claim.sources || []).map(s => {
    const url = typeof s === 'string' ? s : s.url;
    const label = typeof s === 'string' ? s : (s.label || s.url || 'source');
    return url
      ? `<a class="ek-src" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`
      : `<span class="ek-src">${esc(label)}</span>`;
  }).join('');
  const correct = opts.onCorrectHref
    ? `<a class="ek-correct" href="${esc(opts.onCorrectHref)}">correct this</a>`
    : `<button class="ek-correct" type="button" data-ek-correct>correct this</button>`;
  return `<div class="ek-claim ek-${esc(claim.basis)}">
  <div class="ek-top">
    <span class="ek-badge ek-badge-${esc(claim.basis)}">${esc(LABEL[claim.basis] || claim.basis)}</span>
    <span class="ek-conf"><span class="ek-conf-bar" style="width:${pct}%"></span></span>
    <span class="ek-conf-n">${pct}%</span>
  </div>
  <div class="ek-value">${esc(claim.value)}</div>
  ${claim.note ? `<div class="ek-note">${esc(claim.note)}</div>` : ''}
  ${sources ? `<div class="ek-sources">${sources}</div>` : ''}
  <div class="ek-actions">${correct}</div>
</div>`;
}

// Base styles consumers can inject once.
export const EK_STYLES = `
.ek-claim{border:1px solid #d8dee9;border-radius:12px;padding:12px 14px;margin:10px 0;font-family:system-ui,-apple-system,sans-serif;max-width:560px}
.ek-top{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.ek-badge{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:2px 8px;border-radius:999px}
.ek-badge-fact{background:#e6f4ea;color:#137333}
.ek-badge-user-confirmed{background:#e8f0fe;color:#1a56db}
.ek-badge-inferred{background:#fef7e0;color:#a6730a}
.ek-badge-hypothesis{background:#fce8e6;color:#b3261e}
.ek-conf{flex:1;height:6px;background:#eef1f5;border-radius:999px;overflow:hidden;max-width:120px}
.ek-conf-bar{display:block;height:100%;background:#5b8bff}
.ek-conf-n{font-size:12px;color:#5f6b7a;font-variant-numeric:tabular-nums}
.ek-value{font-size:15px;color:#1a2230}
.ek-note{font-size:12.5px;color:#5f6b7a;margin-top:4px}
.ek-sources{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}
.ek-src{font-size:12px;color:#1a56db;text-decoration:none;border:1px solid #d8dee9;border-radius:6px;padding:2px 6px}
.ek-actions{margin-top:8px}
.ek-correct{font-size:12px;color:#5f6b7a;background:none;border:none;text-decoration:underline;cursor:pointer;padding:0}
.ek-error{border-color:#b3261e;color:#b3261e}
`;
