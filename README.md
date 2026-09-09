# Evidence-Kit

A tiny primitive for **evidence-graded claims** — the pattern of separating what is a **fact**, what the **user confirmed**, what was **inferred**, and what is a **hypothesis**, each carrying a **confidence** and **sources**, and rendered so a person can see *why* something is believed and **correct it**.

This extracts a pattern that already recurs across several projects (finance research, position-lens, career-intel, MapleBenefits, and the AI Radar idea) instead of re-implementing it each time. It is the "extract, don't add" move — less new surface, more leverage.

## Use
```js
import { createClaim, isActionable } from './src/claim.js';
import { renderClaim, EK_STYLES } from './src/render.js';

const claim = createClaim({
  value: 'You likely qualify for the GST/HST credit.',
  basis: 'inferred',            // 'fact' | 'user-confirmed' | 'inferred' | 'hypothesis'
  confidence: 0.82,             // 0..1
  sources: [{ label: 'CRA eligibility', url: 'https://…' }],
  note: 'Based on the income and residency you entered.'
});

el.innerHTML = renderClaim(claim);   // framework-agnostic HTML string
isActionable(claim);                 // false unless grounded (fact/confirmed) AND confident
```
Inject `EK_STYLES` once for base styling. No build step; pure ESM.

## Why
Richer context does not make an answer more trustworthy — *showing the evidence and separating hypothesis from fact* does. A UI that grades its claims and invites correction is the honest way to ship AI/decision features. This is a starter: extend the schema (temporal validity, expiry, sensitivity), add framework bindings (React/Web Component), and wire correction callbacks.

## Dev
```bash
npm test              # node --test
# demo: python3 -m http.server, then open /example/
```

_Starter scaffold from the 2026-09-09 roadmap brainstorm (report/08 #3)._
