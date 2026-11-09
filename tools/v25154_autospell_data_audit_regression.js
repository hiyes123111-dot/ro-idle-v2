// v2.5.154：裝備／卡片自動念咒資料完整性回歸
const fs = require('fs');
const vm = require('vm');
function assert(ok, msg) { if (!ok) throw new Error(msg); }
function load(source, names, outName) {
  const context = {};
  vm.createContext(context);
  vm.runInContext(source + `\n;globalThis.__result={${names.join(',')}};`, context);
  return context.__result;
}
const data = load(fs.readFileSync('js/data.js', 'utf8'), ['ITEMS', 'CARDS'], 'data');
const skills = load(fs.readFileSync('js/skills.js', 'utf8'), ['SKILLS'], 'skills').SKILLS;
const entries = [];
const errors = [];
for (const [kind, table] of [['ITEMS', data.ITEMS], ['CARDS', data.CARDS]]) {
  for (const [id, def] of Object.entries(table || {})) {
    for (const e of def.autoSpell || []) {
      entries.push({ kind, id, ...e });
      if (!['attack', 'hit', 'chain'].includes(e.on)) errors.push(`${kind}.${id}: invalid trigger ${e.on}`);
      if (!Number.isFinite(e.chance) || e.chance < 0 || e.chance > 100) errors.push(`${kind}.${id}: invalid chance`);
      if (!e.skill || !skills[e.skill]) errors.push(`${kind}.${id}: missing skill ${e.skill}`);
      if (e.on === 'chain' && !e.after) errors.push(`${kind}.${id}: chain missing after`);
      if (e.on !== 'chain' && e.after) errors.push(`${kind}.${id}: after used outside chain`);
      if (e.upgradeIf && !skills[e.upgradeIf.skill]) errors.push(`${kind}.${id}: missing upgrade skill ${e.upgradeIf.skill}`);
      // 被本作改為一次性效果的被動技能，maxLv=1 不代表裝備原始觸發等級錯誤。
      const sk = skills[e.skill];
      if (sk && sk.type !== 'passive' && e.lv && sk.maxLv && e.lv > sk.maxLv)
        errors.push(`${kind}.${id}: ${e.skill} Lv${e.lv} exceeds maxLv ${sk.maxLv}`);
    }
  }
}
assert(entries.length === 93, `expected 93 autoSpell entries, got ${entries.length}`);
assert(errors.length === 0, errors.join('\n'));
assert(entries.filter(e => e.on === 'attack').length === 56, 'attack trigger count changed');
assert(entries.filter(e => e.on === 'hit').length === 34, 'hit trigger count changed');
assert(entries.filter(e => e.on === 'chain').length === 3, 'chain trigger count changed');
console.log('v2.5.154 autoSpell data audit regression: PASS (93 entries; 56 attack / 34 hit / 3 chain)');
