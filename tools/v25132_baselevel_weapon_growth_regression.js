const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const checks = [
  ['metal weapon growth importer is registered', /BaseLv10Start20Cap120/.test(engine)],
  ['metal weapon growth starts at BaseLv20 and caps at 120', /if \(lv >= 20\) total \+= Math\.floor\(lv \/ 10\) \* all\[k\]/.test(engine)],
  ['probation weapon growth caps at BaseLv160', /Math\.floor\(Math\.min\(state\.baseLevel \|\| 0, 160\) \/ 10\) \* all\[k\]/.test(engine)],
  ['metal katar receives BaseLv ATK growth', /"metal_katar"[\s\S]*?perBaseLv10Start20Cap120_atk":5/.test(data)],
  ['metal foxtail receives BaseLv ATK and MATK growth', /"metal_foxtail"[\s\S]*?perBaseLv10Start20Cap120_atk":3[\s\S]*?perBaseLv10Start20Cap120_matk":3/.test(data)],
  ['probation staff receives capped BaseLv MATK growth', /"probation_staff"[\s\S]*?perBaseLv10Cap160_matk":6/.test(data)],
  ['probation dagger receives capped BaseLv ATK and MATK growth', /"probation_dagger"[\s\S]*?perBaseLv10Cap160_atk":3[\s\S]*?perBaseLv10Cap160_matk":3/.test(data)],
  ['upgrade katar receives BaseLv70+ ATK growth', /"upg_katar"[\s\S]*?perBaseLv10_atk":10/.test(data)],
  ['scarlet huuma receives BaseLv70+ ATK growth', /"scarlet_huuma"[\s\S]*?perBaseLv10_atk":5/.test(data)],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  if (!ok) failed++;
}
console.log(`${checks.length - failed}/${checks.length} checks passed`);
process.exitCode = failed ? 1 : 0;
