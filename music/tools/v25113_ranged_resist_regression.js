const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const checks = [
  ['遠距離判定排除魔法技能', /if \(!sk \|\| sk\.magic\) return false/.test(engine)],
  ['遠距離物理技能採明確 ID 白名單', /AC_DOUBLE[\s\S]*AC_SHOWER[\s\S]*AC_CHARGEARROW[\s\S]*SN_SHARPSHOOTING/.test(engine)],
  ['怪物技能傷害路徑消費 rangedDmgResist', /isMonsterRangedPhysicalSkill\(sk\)\) \{[\s\S]*getCardBonus\('rangedDmgResist'\)[\s\S]*getCardBonus\('rangedDmgTakenPct'\)/.test(engine)],
  ['城戰戰袍遠距離減傷資料保留', /siege_suits[\s\S]*rangedDmgResist:20/.test(data)],
  ['城戰外袍遠距離減傷資料保留', /siege_robe[\s\S]*rangedDmgResist:15/.test(data)],
  ['近衛兵帽子遠距離減傷資料保留', /palace_guard_cap[\s\S]*rangedDmgResist:1/.test(data)],
  ['階級增傷仍明確列為未接線，不冒用 BOSS 判定', /allClassDmg:3/.test(data) && !/getCardBonus\('allClassDmg'\)/.test(engine)]
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
console.log(`${checks.length - failed}/${checks.length} passed`);
process.exitCode = failed ? 1 : 0;
