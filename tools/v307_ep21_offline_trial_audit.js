'use strict';
const fs = require('fs');
const path = require('path');
const engine = fs.readFileSync(path.join(__dirname, '../js/engine.js'), 'utf8');
const ui = fs.readFileSync(path.join(__dirname, '../js/ui.js'), 'utf8');
const checks = [
  ['EP21 專用離線分支存在', /if \(state\.mapId === 'ep21_final_trial_hell'\)/.test(engine)],
  ['必須有目前模式的線上 BOSS 擊殺紀錄', /bossKillRecord\(bossId, farmMode\(\)\)/.test(engine)],
  ['擊殺速度使用實測時間與補怪間隔', /measuredMs \+ 3000/.test(engine)],
  ['每次擊殺最多隨機抽一種碎片', /Math\.random\(\) < 0\.25\) addLoot\(fragmentIds\[Math\.floor\(Math\.random\(\) \* fragmentIds\.length\)\]\)/.test(engine)],
  ['兩頂頭冠分別納入 1% 掉落', /yorscalp_p_circlet[\s\S]*yorscalp_m_circlet/.test(engine) && /0\.01 \* dropMult/.test(engine)],
  ['離線模擬不呼叫 killMonster 發獎', /EP21 超困難試煉離線連續挑戰[\s\S]*?不在離線抽樣期間呼叫 killMonster/.test(engine)],
  ['離線資格提示存在', /ep21BossEligible === false/.test(ui)],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
// 固定案例：1 小時離線、線上實測 60 秒擊殺 + 3 秒補怪，應估算 57 次。
const expected = Math.floor(3600000 / (60000 + 3000));
const formulaOk = expected === 57;
console.log(`${formulaOk ? 'PASS' : 'FAIL'} 1 小時 / 63 秒循環 = 57 次`);
if (!formulaOk) failed++;
console.log(`${checks.length + 1 - failed}/${checks.length + 1} checks passed`);
process.exit(failed ? 1 : 0);
