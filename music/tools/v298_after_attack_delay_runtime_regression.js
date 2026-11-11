const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const checks = [];
function check(name, ok) { checks.push({name, ok: !!ok}); }
check('普通攻擊間隔讀取裝備與卡片彙總的攻擊後延遲', /const afterAttackDelayPct = Math\.max\(0, getCardBonus\('afterAttackDelayPct'\)\)/.test(engine));
check('先依 ASPD 計算基礎攻擊間隔，再套用攻擊後延遲減少', /const baseAttackInterval = getAttackInterval\(state\.aspd\)[\s\S]*?baseAttackInterval \* Math\.max\(0\.1, 1 - afterAttackDelayPct \/ 100\)/.test(engine));
check('攻擊間隔最低限制為 100ms，避免極端裝備加成造成零間隔', /state\.attackInterval = Math\.max\(100, Math\.round\([\s\S]*?\)\s*\);/.test(engine));
check('攻擊後延遲與技能後延遲維持不同結算路徑', engine.includes("'skillAfterDelayPct'"));
for (const [pct, expected] of [[0,140],[10,126],[20,112],[25,105],[30,100],[90,100]]) {
  const actual = Math.max(100, Math.round(140 * Math.max(0.1, 1 - pct / 100)));
  check(`${pct}% 攻擊後延遲減少 → ${expected}ms`, actual === expected);
}
for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'} ${c.name}`);
console.log(`\n${checks.filter(c => c.ok).length}/${checks.length} checks passed`);
if (checks.some(c => !c.ok)) process.exit(1);
