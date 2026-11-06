const fs = require('fs');
const s = fs.readFileSync('js/engine.js','utf8');
const checks = [
  ['Frost Diver / Stone Curse use skill-aware MATK base', /skillBaseDamage\(true, monDef, elemMult, sk\)/.test(s)],
  ['Frost Diver / Stone Curse apply skill damage bonus', /skillBaseDamage\(true, monDef, elemMult, sk\)[\s\S]{0,180}getSkillDamageBonus\(sk\)/.test(s)],
  ['Frost Diver / Stone Curse apply target card and ailment modifiers', /cardTargetDmgMult\(monDef\) \* ailDmgTakenMult\(mon\)/.test(s)],
  ['Magic Crasher retains MATK source and physical mitigation with skill bonus', /state\.matk \* state\.magicCrasherMult[\s\S]{0,220}getSkillDamageBonus\(procSkill\)[\s\S]{0,150}defOf\(monDef, 1, false, target\)/.test(s)],
  ['Spear Counter uses target-instance mitigation and ailment damage taken', /state\.spearCounterMult[\s\S]{0,180}ailDmgTakenMult\(mon\)[\s\S]{0,80}defOf\(monDef, 1, false, mon\)/.test(s)],
  ['Spear Boomerang uses target-instance mitigation and ailment damage taken', /state\.spearBoomerangMult[\s\S]{0,180}ailDmgTakenMult\(mon\)[\s\S]{0,80}defOf\(monDef, 1, false, mon\)/.test(s)],
  ['Charge proc uses target-instance mitigation and ailment damage taken', /state\.chargeRandomMult[\s\S]{0,180}ailDmgTakenMult\(mon\)[\s\S]{0,80}defOf\(monDef, 1, false, mon\)/.test(s)],
  ['Poison React uses target-instance mitigation and ailment damage taken', /state\.poisonReactMult[\s\S]{0,180}ailDmgTakenMult\(mon\)[\s\S]{0,80}defOf\(monDef, 1, false, mon\)/.test(s)],
  ['Counter Attack uses target-instance mitigation and ailment damage taken', /1\.5 \* \(1 \+ getSkillDamageBonus\(procSkill\) \/ 100\) \* cardTargetDmgMult\(monDef\) \* ailDmgTakenMult\(mon\)/.test(s)],
];
for (const [name, ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
if (checks.some(x=>!x[1])) process.exit(1);
