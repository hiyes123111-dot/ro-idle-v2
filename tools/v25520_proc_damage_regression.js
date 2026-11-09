const fs = require('fs');
const s = fs.readFileSync('js/engine.js','utf8');
const checks = [
  ['single-target ranger proc includes target modifiers and skill bonus', /skillBaseDamage\(false, def, elem, sk\) \* mult \* bonus \* elementDmgMult\(sk\.element \|\| 'neutral'\) \* cardTargetDmgMult\(def\) \* ailDmgTakenMult\(mon\)/.test(s)],
  ['single-target trap includes target modifiers and skill bonus', /skillBaseDamage\(false, monDef, elemMult, sk\) \* mult \* \(1 \+ getSkillDamageBonus\(sk\) \/ 100\).*cardTargetDmgMult\(monDef\)/.test(s)],
  ['AOE trap includes target modifiers and skill bonus', /skillBaseDamage\(false, mDef, elemMult, sk\) \* mult \* \(1 \+ getSkillDamageBonus\(sk\) \/ 100\).*cardTargetDmgMult\(mDef\)/.test(s)],
  ['race flat bonus is applied after mitigation in proc paths', /\+ raceFlatBonus\(def\)/.test(s) && /\+ raceFlatBonus\(monDef\)/.test(s)],
  ['ranger skills still use independent per-skill cooldowns', /rangerPassiveReadyAt\[id\]/.test(s)],
  ['passive proc statistics are fully removed while cooldowns remain', !/recordRangerProc|rangerProcStats\s*[:=]/.test(s) && /rangerPassiveReadyAt\[id\]/.test(s)],
];
for (const [name, ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
if (checks.some(x=>!x[1])) process.exit(1);
