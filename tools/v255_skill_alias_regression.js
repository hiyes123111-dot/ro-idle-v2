const fs = require('fs');
const vm = require('vm');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const registryFiles = ['skills.js', 'v2_content.js', 'v2_4_content.js', 'v2_5_content.js', 'v2_6_skill_migration.js'];
const registered = new Set();
for (const file of registryFiles) {
  const src = fs.readFileSync('js/' + file, 'utf8');
  for (const m of src.matchAll(/^\s{2}([A-Za-z0-9_]+):\s*\{/gm)) registered.add(m[1]);
  for (const m of src.matchAll(/(?:active|passive|put)\('([^']+)'/g)) registered.add(m[1]);
}
const start = engine.indexOf('function getSkillDamageBonus(sk)');
const end = engine.indexOf('\nfunction canonicalBonusKey', start);
if (start < 0 || end <= start) throw new Error('getSkillDamageBonus not found');
const ctx = { values: {}, SKILLS: Object.fromEntries([...registered].map(id => [id, {id}])) };
ctx.getCardBonus = key => ctx.values[key] || 0;
vm.runInNewContext(engine.slice(start, end) + '\nthis.getSkillDamageBonus = getSkillDamageBonus;', ctx);
const cases = [
  ['tigercannon', 'v2_in_tiger_cannon'], ['axe_tornado', 'me_tornado'],
  ['crimson_rock', 'v2_am_crimson_rock'], ['cannonattack', 'gn_cartcannon'],
  ['heavymetal', 'mi_soundblend'], ['holyspear', 'v2_ca_holy_spear'],
  ['counterSlash', 'gx_counter'], ['melodystrike', 'cg_arrowvulcan'],
  ['holy_light', 'holylight'], ['me_axe_tornado', 'me_tornado'],
  ['hundredspear', 'rk_hundredspear'], ['rollingcutter', 'gx_rollingcutter'],
  ['windcutter', 'rk_windcutter']
];
for (const [legacy, skillId] of cases) {
  if (!ctx.SKILLS[skillId]) throw new Error(`alias target is not in actual registry: ${skillId}`);
  ctx.values = { ['skillDmg_' + legacy]: 17 };
  const got = ctx.getSkillDamageBonus({ id: skillId });
  if (got !== 17) throw new Error(`${legacy} -> ${skillId}: expected 17, got ${got}`);
}
ctx.values = { skillDmg_v2_in_tiger_cannon: 9, skillDmg_tigercannon: 17 };
if (ctx.getSkillDamageBonus({ id: 'v2_in_tiger_cannon' }) !== 9) throw new Error('exact ID must take precedence');
ctx.values = { skillDmg_cannonattack: 17 };
if (ctx.getSkillDamageBonus({ id: 'v2_in_tiger_cannon' }) !== 0) throw new Error('unknown alias must not leak');
ctx.values = { skillDmg_axe_tornado: 10, skillDmg_me_axe_tornado: 15 };
if (ctx.getSkillDamageBonus({ id: 'me_tornado' }) !== 25) throw new Error('multiple aliases must sum');
console.log(`PASS ${cases.length} aliases target IDs parsed from actual registry; exact precedence, isolation and multi-alias sum PASS`);
