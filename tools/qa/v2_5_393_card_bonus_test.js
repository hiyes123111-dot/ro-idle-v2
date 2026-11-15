const fs = require('fs');
const assert = require('assert');
const engine = fs.readFileSync(require('path').join(__dirname, '../../js/engine.js'), 'utf8');
function extractFunction(name) {
  const start = engine.indexOf(`function ${name}(`);
  assert(start >= 0, `missing ${name}`);
  const brace = engine.indexOf('{', start);
  let depth = 0, quote = null, esc = false;
  for (let i = brace; i < engine.length; i++) {
    const ch = engine[i];
    if (quote) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}' && --depth === 0) return engine.slice(start, i + 1);
  }
  throw new Error(`unclosed function ${name}`);
}
const helpers = new Function(`${extractFunction('canonicalBonusKey')}; ${extractFunction('mergeBonus')}; return { canonicalBonusKey, mergeBonus };`)();
const { canonicalBonusKey, mergeBonus } = helpers;
assert.strictEqual(canonicalBonusKey('crit'), 'critRate');
assert.strictEqual(canonicalBonusKey('critRate'), 'critRate');
assert.strictEqual(canonicalBonusKey('cRate'), 'cRate');
const total = {};
mergeBonus(total, { crit: 5, cRate: 2, critRate: 3 });
assert.deepStrictEqual(total, { critRate: 8, cRate: 2 });
assert(engine.includes("state.cRate = Math.floor(traitCRT / 3) + getCardBonus('cRate');"));
assert(engine.includes("state.critRate = Math.min(100, state.critRate + getCardBonus('critRate')"));
console.log('v2.5.393 card bonus tests: 6/6 passed');
