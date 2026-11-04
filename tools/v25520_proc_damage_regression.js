const fs = require('fs');
const s = fs.readFileSync('js/engine.js','utf8');
const checks = [
  ['single-target ranger proc includes target damage modifiers', /skillBaseDamage\(false, def, elem\) \* mult \* bonus \* elementDmgMult\(sk\.element \|\| 'neutral'\) \* cardTargetDmgMult\(def\) \* ailDmgTakenMult\(mon\)/.test(s)],
  ['single-target trap includes target damage modifiers', /skillBaseDamage\(false, monDef, elemMult\) \* mult \* elementDmgMult\(sk\.element \|\| 'neutral'\) \* cardTargetDmgMult\(monDef\) \* ailDmgTakenMult\(target\)/.test(s)],
  ['AOE trap includes target damage modifiers', /skillBaseDamage\(false, mDef, elemMult\) \* mult \* elementDmgMult\(sk\.element \|\| 'neutral'\) \* cardTargetDmgMult\(mDef\) \* ailDmgTakenMult\(mon\)/.test(s)],
  ['race flat bonus is applied after mitigation in proc paths', /\+ raceFlatBonus\(def\)/.test(s) && /\+ raceFlatBonus\(monDef\)/.test(s)],
  ['ranger skills still use independent per-skill cooldowns', /rangerPassiveReadyAt\[id\]/.test(s)],
  ['ranger proc still records actual roll and proc outcomes', /recordRangerProc\(id, 'rolls'\)/.test(s) && /recordRangerProc\(id, 'procs'\)/.test(s)],
];
for (const [name, ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
if (checks.some(x=>!x[1])) process.exit(1);
