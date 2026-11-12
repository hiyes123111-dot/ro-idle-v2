const fs = require('fs');
const engine = fs.readFileSync(__dirname + '/../js/engine.js', 'utf8');
const data = fs.readFileSync(__dirname + '/../js/data.js', 'utf8');
const checks = [
  ['EP21 spawn no longer blocks cleared state', !engine.includes("if (map && map.id === 'ep21_final_trial_hell' && state.ep21TrialCleared)")],
  ['Boss kill removes defeated boss from active list', /if \(isEp21TrialBoss\) \{[\s\S]*?state\.monsters = \(state\.monsters \|\| \[\]\)\.filter\(m => m !== monObj\)/.test(engine)],
  ['Boss kill leaves continuous spawn enabled', /試煉將持續進行，稍後自動迎戰下一隻首領/.test(engine)],
  ['Game tick continues to call spawnMonster', /tickRelicShield\(\);[\s\S]{0,120}spawnMonster\(\);/.test(engine)],
  ['Map description identifies idle continuous challenge', /EP21 超困難試煉掛機狩場。擊敗被侵蝕的坦後會自動刷新下一隻/.test(data)],
  ['Boss remains sole map spawn', /id: 'ep21_final_trial_hell'[\s\S]{0,180}monsters: \[\{ id: 'ep21_corrupted_tan', weight: 100 \}\]/.test(data)]
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
if (failed) process.exit(1);
console.log(`\n${checks.length}/${checks.length} checks passed`);
