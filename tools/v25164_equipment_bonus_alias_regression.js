// v2.5.164 targeted equipment bonus regression checks
const fs = require('fs');
const engine = fs.readFileSync(require('path').join(__dirname, '..', 'js', 'engine.js'), 'utf8');
function assert(ok, msg) { if (!ok) throw new Error(msg); }
assert(engine.includes("magicignoredef: 'mdefIgnorePct'"), 'magicIgnoreDef must map to general MDEF ignore');
assert(engine.includes("getCardBonus('allClassDmg')"), 'allClassDmg must be consumed');
assert(engine.includes('allClassPhysical'), 'allClassDmg must stay in physical target multiplier');
assert(!engine.includes("allclassdmg: 'allTargetDmgPct'"), 'allClassDmg must not leak into magic damage');
console.log('v2.5.164 equipment bonus alias regression: PASS');
