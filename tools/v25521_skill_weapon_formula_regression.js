const fs = require('fs');
const s = fs.readFileSync('js/engine.js','utf8');
const checks = [
  ['single-target physical/magic skills pass skill metadata into weapon damage chain', /skillBaseDamage\(useMag, def, elemMult, sk\) \* skillMult/.test(s)],
  ['AOE skills pass skill metadata into weapon damage chain', /skillBaseDamage\(useMag, monDef, monElemMult, sk\) \* aoeMult/.test(s)],
  ['DOT skills pass skill metadata into weapon damage chain', /skillBaseDamage\(useMag, def, elemMult, sk\) \* mult \* \(1 \+ dotEleDmgBonus\)/.test(s)],
  ['poison direct hit passes skill metadata into weapon damage chain', /skillBaseDamage\(useMag, def, elemMult, sk\) \* mult \* ailDmgTakenMult/.test(s)],
  ['poison DOT base passes skill metadata into weapon damage chain', /applyPoisonDot\(target, def, skillBaseDamage\(useMag, def, elemMult, sk\) \* mult\)/.test(s)],
  ['multi-hit first and second hits pass skill metadata', /skillBaseDamage\(useMag, def, elemMult, sk\) \* mult \* \(1 \+ mhEleDmgBonus\)/.test(s) && /skillBaseDamage\(useMag, monDef, monElemMult, sk\) \* mult2/.test(s)],
  ['size-dependent multi attack passes skill metadata', /skillBaseDamage\(useMag, def, elemMult, sk\) \* mult \* \(1 \+ multiEleDmgBonus\)/.test(s)],
  ['special charge passes skill metadata', /skillBaseDamage\(useMag, def, elemMult, sk\) \* mult \* \(1 \+ scEleDmgBonus\)/.test(s)],
];
for (const [name, ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
if (checks.some(x=>!x[1])) process.exit(1);
