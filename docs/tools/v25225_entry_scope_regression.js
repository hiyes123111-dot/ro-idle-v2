const fs = require('fs');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const fnStart = engine.indexOf('function playerAttackInner()');
const fnEnd = engine.indexOf('\nfunction ', fnStart + 1);
const body = engine.slice(fnStart, fnEnd < 0 ? engine.length : fnEnd);
const topLevelAfter = engine.slice(fnEnd < 0 ? engine.length : fnEnd);
const checks = [
  ['Spell Fist handling remains inside playerAttackInner', fnStart >= 0 && body.includes('const fist = state.spellFist;')],
  ['Spell Fist code is not left as a top-level engine expression', !/^\s*const fist = state\.spellFist;/m.test(topLevelAfter)],
  ['playerAttackInner still closes before subsequent functions', fnEnd > fnStart]
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
if (failed) process.exit(1);
console.log(`${checks.length}/${checks.length} passed`);
