// v2.5.152 equipment skill refresh regression
const fs = require('fs');
const engine = fs.readFileSync('js/engine.js', 'utf8');
function assert(ok, msg) { if (!ok) throw new Error(msg); }
function bodyOf(name) {
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
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}' && --depth === 0) return engine.slice(brace, i + 1);
  }
  throw new Error(`unterminated ${name}`);
}
for (const name of ['equipItem', 'equipInstance', 'unequipItem']) {
  const body = bodyOf(name);
  assert(body.includes('recomputeDerived(false)'), `${name} must refresh derived stats/cardSkills`);
}
const cardStart = engine.indexOf('function cardGrantedSkills()');
const cardEnd = engine.indexOf('function skillLv(', cardStart);
assert(cardStart >= 0 && cardEnd > cardStart, 'card skill resolver missing');
const resolver = engine.slice(cardStart, cardEnd);
assert(resolver.includes('allEquippedCards()'), 'equipped card scan missing');
assert(resolver.includes('getEquipBaseItemId(slot)'), 'equipment-granted skills scan missing');
console.log('v2.5.152 equipment skill refresh regression: PASS');
