const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const content = fs.readFileSync(path.join(root, 'js/v2_5_content.js'), 'utf8');
const checks = [];
function check(name, ok) { checks.push({name, ok: !!ok}); }

const killStart = engine.indexOf('function killMonster(');
const killEnd = engine.indexOf('\nfunction tryAutoRevive(', killStart);
const killBody = killStart >= 0 && killEnd > killStart ? engine.slice(killStart, killEnd) : '';
const clearIndex = killBody.indexOf('field.windhawkProgressiveStacks = 0;');
const filterIndex = killBody.indexOf('field.monsters = field.monsters.filter');
check('擊殺流程先移除怪物，再檢查戰場是否清空', filterIndex >= 0 && clearIndex > filterIndex);
check('最後一隻怪物擊敗後將漸進射擊層數歸零', /if\s*\(!field\.monsters\s*\|\|\s*field\.monsters\.length\s*===\s*0\)\s*\{\s*field\.windhawkProgressiveStacks\s*=\s*0;\s*field\.windhawkProgressiveLastCastAt\s*=\s*0;\s*\}/.test(killBody));
check('隊員代打時重置使用 allyOwnerState 的角色狀態', /const field = allyOwnerState\(\)/.test(killBody) && /field\.windhawkProgressiveStacks = 0/.test(killBody));
check('玩家死亡清空怪物時同步清除漸進射擊層數', /function onPlayerDown\(\)[\s\S]*?state\.monsters = \[\];\s*state\.windhawkProgressiveStacks = 0;/.test(engine));
check('漸進射擊仍限制最多 3 層', /sk\.progressiveShotMaxStacks\s*=\s*3/.test(content));
check('漸進射擊仍保留 600%～4200% 技能倍率', /sk\.mult\s*=\s*\[6,15,24,33,42\]/.test(content));

for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'} ${c.name}`);
console.log(`\n${checks.filter(c => c.ok).length}/${checks.length} checks passed`);
if (checks.some(c => !c.ok)) process.exit(1);
