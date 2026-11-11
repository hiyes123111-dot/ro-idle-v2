const fs = require('fs');
const engine = fs.readFileSync('js/engine.js','utf8');
const migration = fs.readFileSync('js/v2_6_skill_migration.js','utf8');
const checks = [
  ['Two-hand defense official size table', /\[1,2,3\].*\[2,3,5\].*\[3,5,7\]/s.test(engine) && /\[10,15,18\]/.test(engine)],
  ['Two-hand sword/spear/axe gate', /c\s*===\s*'sword2'\s*\|\|\s*c\s*===\s*'spear2'\s*\|\|\s*c\s*===\s*'axe2'/.test(engine)],
  ['Two-hand defense applied to monster basic hits', /applyDKTwoHandDefense\(raw, monDef\)/.test(engine)],
  ['Two-hand defense applied to ally basic hits', /applyDKTwoHandDefense\(monsterBaseAtk\(monDef, undefined, mon\)/.test(engine)],
  ['Two-hand defense applied to physical monster skills', /raw = applyDKTwoHandDefense\(raw, monDef\)/.test(engine)],
  ['Charging Pierce active skill type', /put\('dk_chargingpierce'.*?'dk_charging_pierce'/s.test(migration)],
  ['Charging Pierce 90-180s duration', /duration: \[90,100,110,120,130,140,150,160,170,180\]/.test(migration)],
  ['Charging Pierce 10 stacks and 5s reset', /c\.stacks>=10/.test(engine) && />=5000/.test(engine)],
  ['Charging Pierce multipliers', /id==='lk_spiralpierce'\?1\.5:2/.test(engine)],
  ['Servant Sign remains capacity-only', /capacityOnly: \['dk_servantsign'/.test(migration)],
];
let failed=0;
for (const [name,ok] of checks) { console.log(`${ok?'PASS':'FAIL'} ${name}`); if(!ok) failed++; }
console.log(`${checks.length-failed}/${checks.length} passed`);
process.exitCode=failed?1:0;
