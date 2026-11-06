const fs = require('fs');
const s = fs.readFileSync('js/engine.js','utf8');
const checks = [
  ['single-target trap passes its skill metadata and applies skill damage bonus', /skillBaseDamage\(false, monDef, elemMult, sk\) \* mult \* \(1 \+ getSkillDamageBonus\(sk\) \/ 100\)/.test(s)],
  ['AOE trap passes its skill metadata and applies skill damage bonus', /skillBaseDamage\(false, mDef, elemMult, sk\) \* mult \* \(1 \+ getSkillDamageBonus\(sk\) \/ 100\)/.test(s)],
  ['ranger passive passes its skill metadata into weapon formula', /skillBaseDamage\(false, def, elem, sk\) \* mult \* bonus/.test(s)],
  ['single-target on-attack proc resolves its own skill metadata', /skillBaseDamage\(false, monDef, elemMult, findSkillById\(e\.id\)\)/.test(s)],
  ['AOE on-attack proc resolves its own skill metadata', /skillBaseDamage\(false, md, elemMult, findSkillById\(e\.id\)\)/.test(s)],
  ['falcon passive resolves skill-specific weapon formula metadata', /skillBaseDamage\(false, monDef, bbElemMult, bbSkill\)/.test(s)],
  ['physical AOE passive includes skill damage bonus at setup', /mult: val \* \(1 \+ getSkillDamageBonus\(sk\) \/ 100\)/.test(s)],
  ['ranger skills retain independent cooldowns without statistics overhead', /rangerPassiveReadyAt\[id\]/.test(s) && !/recordRangerProc|rangerProcStats\s*[:=]/.test(s)],
];
for (const [name, ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
if (checks.some(x=>!x[1])) process.exit(1);
