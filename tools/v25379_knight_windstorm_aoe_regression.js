#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const data = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const checks = [
  ['冰暴騎士卡片仍為武器卡', /knight_windstorm_card:[\s\S]{0,260}?\"slot\":\"weapon\"/.test(data)],
  ['卡片仍為普攻5%自動暴風雪Lv1', /knight_windstorm_card:[\s\S]{0,500}?\"on\":\"attack\",\"skill\":\"stormgust\",\"lv\":1,\"chance\":5/.test(data)],
  ['暴風雪技能仍為範圍魔法場域', /stormgust:[\s\S]{0,260}?\"type\":\"field_aoe_magic\"/.test(fs.readFileSync(path.join(root, 'js/skills.js'), 'utf8'))],
  ['場域施放時快照所有存活怪物', /const fieldTargetIds = state\.monsters\.filter\(mon => mon && mon\.hp > 0\)\.map\(mon => mon\.id\)/.test(engine)],
  ['場域使用獨立範圍魔法類型並保存目標', /kind: 'field_magic_aoe', skillId: sk\.id, skillLv: lv,[\s\S]{0,160}?targetIds: fieldTargetIds/.test(engine)],
  ['每跳對所有快照目標逐一結算', /f\.kind === 'field_magic_aoe'[\s\S]{0,900}?liveMonsters\.forEach\(mon =>/.test(engine)],
  ['已離場或死亡怪物不再受擊', /mon\.hp > 0 && \(!Array\.isArray\(f\.targetIds\) \|\| f\.targetIds\.includes\(mon\.id\)\)/.test(engine)],
  ['舊 aoe_holydmg 保持相容', /f\.kind === 'field_magic_aoe' \|\| f\.kind === 'aoe_holydmg'/.test(engine)],
  ['沒有更改卡片觸發機率', /\"chance\":5/.test(data.slice(data.indexOf('knight_windstorm_card:'), data.indexOf('knight_windstorm_card:')+500))]
];
// 動態驗證：直接抽出正式 tickFieldEffects() 執行，確認同一個暴風雪場域會命中多隻怪物。
function extractFunction(source, signature) {
  const start = source.indexOf(signature);
  if (start < 0) throw new Error(`function not found: ${signature}`);
  const brace = source.indexOf('{', start);
  let depth = 0, quote = null, escape = false;
  for (let i = brace; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      if (escape) escape = false;
      else if (c === '\\') escape = true;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '\"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    if (c === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`unterminated function: ${signature}`);
}
const tickFn = extractFunction(engine, 'function tickFieldEffects()');
const runtime = {
  state: {matk:100,
    activeFieldEffects: [{kind:'field_magic_aoe',skillId:'stormgust',targetIds:[1,2,3],name:'暴風雪',mult:1,element:'water',tickIntervalSec:1,nextTickAt:0,endsAt:10000}],
    monsters: [1,2,3].map(id => ({id,defId:'test',hp:1000,maxHp:1000}))
  },
  MONSTERS: {test:{name:'測試怪',element:'fire'}},
  getElementMultiplierVsMonster: () => 1,
  mitigateDamage: n => n,
  defOf: () => [],
  wakeIfFrozen: () => {},
  applyStun: () => {},
  pushCombatLog: () => {},
  showDamageFloatAt: () => {},
  killMonster: () => {},
  renderLog: () => {},
  Date: {now: () => 1000},
  Math
};
vm.runInNewContext(`${tickFn}; tickFieldEffects();`, runtime);
const hitCount = runtime.state.monsters.filter(m => m.hp < 1000).length;
checks.push(['動態測試：同一次暴風雪場域命中3隻怪物', hitCount === 3]);
checks.forEach(([name, ok]) => console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`));
console.log(`\n${checks.filter(x => x[1]).length}/${checks.length} checks passed`);
if (checks.some(x => !x[1])) process.exit(1);
