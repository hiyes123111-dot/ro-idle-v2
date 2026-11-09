const fs = require('fs');
const vm = require('vm');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const v2 = fs.readFileSync('js/v2_content.js', 'utf8');
const start = engine.indexOf('function getSkillDamageBonus(sk)');
const end = engine.indexOf('\nfunction canonicalBonusKey', start);
if (start < 0 || end <= start) throw new Error('getSkillDamageBonus not found');
const idPattern = /(?:active|passive)\('([^']+)'/g;
const registered = new Set([...skills.matchAll(/^\s{2}([a-zA-Z0-9_]+):\s*\{/gm)].map(m => m[1]));
for (const m of v2.matchAll(idPattern)) registered.add(m[1]);
const ctx = { values: {}, SKILLS: Object.fromEntries([...registered].map(id => [id, {id}])) };
ctx.getCardBonus = key => ctx.values[key] || 0;
vm.runInNewContext(engine.slice(start, end) + '\nthis.getSkillDamageBonus = getSkillDamageBonus;', ctx);
const cases = [
  ['tigercannon', 'v2_in_tiger_cannon'],
  ['axe_tornado', 'me_tornado'],
  ['crimson_rock', 'v2_am_crimson_rock'],
  ['cannonattack', 'gn_cartcannon'],
  ['heavymetal', 'mi_soundblend'],
  ['holyspear', 'v2_ca_holy_spear'],
  ['counterSlash', 'gx_counter'],
  ['melodystrike', 'cg_arrowvulcan'],
];
for (const [legacy, skillId] of cases) {
  if (!ctx.SKILLS[skillId]) throw new Error(`alias target is not registered: ${skillId}`);
  ctx.values = { ['skillDmg_' + legacy]: 17 };
  const got = ctx.getSkillDamageBonus({ id: skillId });
  if (got !== 17) throw new Error(`${legacy} -> ${skillId}: expected 17, got ${got}`);
}
ctx.values = { skillDmg_v2_in_tiger_cannon: 9, skillDmg_tigercannon: 17 };
if (ctx.getSkillDamageBonus({ id: 'v2_in_tiger_cannon' }) !== 9) throw new Error('exact ID must take precedence');
ctx.values = { skillDmg_cannonattack: 17 };
if (ctx.getSkillDamageBonus({ id: 'v2_in_tiger_cannon' }) !== 0) throw new Error('unverified legacy alias must not leak to unrelated skills');
console.log(`PASS ${cases.length} aliases target registered skills; exact ID precedence PASS; unknown alias isolation PASS`);
