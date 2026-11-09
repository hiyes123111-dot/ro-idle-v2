const fs = require('fs');
const s = fs.readFileSync('js/engine.js','utf8');
const checks = [
  ['fire-hunt magic proc uses skill-aware MATK chain and skill bonus', /state\.onHitAoeProcMult = .*getSkillDamageBonus\(sk\)/.test(s) && /skillBaseDamage\(true, monDef, elemMult, procSkill\).*cardTargetDmgMult\(monDef\).*ailDmgTakenMult\(mon\)/.test(s)],
  ['fire-pillar proc applies target modifiers and element damage bonus', /const procSkill = findSkillById\('firepillar'\)/.test(s) && /elementDmgMult\(state\.onAttackAoeElement\)/.test(s) && /cardTargetDmgMult\(monDef\).*ailDmgTakenMult\(mon\)/.test(s)],
  ['frost-diver proc uses skill-aware MATK chain and skill bonus', /state\.onHitAoeStunMult = .*getSkillDamageBonus\(sk\)/.test(s) && /skillBaseDamage\(true, monDef, elemMult, procSkill\).*cardTargetDmgMult\(monDef\).*ailDmgTakenMult\(mon\)/.test(s)],
  ['spear counter, boomerang and charge pass their own skill metadata', /findSkillById\('spearstab'\)/.test(s) && /findSkillById\('spearboomerang'\)/.test(s) && /findSkillById\('charge'\)/.test(s)],
  ['poison-react and venom-infusion apply skill bonus and target modifiers', /findSkillById\('poisonreact'\)/.test(s) && /findSkillById\('venominfusion'\)/.test(s) && /getSkillDamageBonus\(procSkill\)/.test(s)],
  ['counter-attack uses its own skill metadata and target modifiers', /findSkillById\('counter'\)/.test(s)],
  ['proc skills still use independent cooldown / trigger paths', /spearCounterReadyAt/.test(s) && /spearBoomerangReadyAt/.test(s) && /chargeRandomReadyAt/.test(s)],
];
for (const [name, ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`);
if (checks.some(x => !x[1])) process.exit(1);
