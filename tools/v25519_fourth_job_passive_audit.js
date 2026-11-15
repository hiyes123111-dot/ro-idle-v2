const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const root = __dirname + '/..';
const context = { console, Date, Math, JSON, Object, Array, Set, Map, Number, String, RegExp,
  window: { addEventListener() {}, location: {} },
  document: { addEventListener() {}, getElementById(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];}, createElement(){return {};}, body:{classList:{add(){},remove(){}},appendChild(){}} }, navigator:{} };
context.window.window = context.window;
vm.createContext(context);
for (const file of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js'])
  vm.runInContext(fs.readFileSync(`${root}/js/${file}`,'utf8'), context, {filename:file});
const jobs = vm.runInContext(`Object.entries(JOB_TREE).filter(([id,j]) => j.tier >= 4).map(([id,j]) => ({id,name:j.name,skills:j.skills||[]}))`, context);
const all = jobs.flatMap(j => j.skills.map(s => ({...s, jobId:j.id})));
const passive = all.filter(s => s.type === 'passive');
const engine = fs.readFileSync(`${root}/js/engine.js`,'utf8');
const handled = new Set([...engine.matchAll(/case '([^']+)'/g)].map(m=>m[1]));
handled.add('rangerTrapProc');
handled.add('passive');
const pending = new Set(['capacityOnly']);
const unsupported = [...new Set(passive.map(s=>s.passiveStat).filter(Boolean))].filter(stat => !handled.has(stat) && !pending.has(stat));
assert.strictEqual(jobs.length, 13, 'all 13 fourth-job classes are represented');
assert.deepStrictEqual(unsupported, [], `fourth-job passive stats need runtime handlers: ${unsupported.join(', ')}`);
const special = passive.filter(s => !s.passiveStat && (s.passiveHolyPct || s.maceBookMasteryBySize));
const twoHandDefense = passive.find(s => s.id === 'dk_twohanddef');
assert(twoHandDefense && /dkHasTwoHandDefenseWeapon/.test(engine), 'Dragon Knight Two-handed Defense has a weapon-gated damage-reduction consumer');
assert.strictEqual(special.length, 2, 'Cardinal has two specialized passive records');
assert(engine.includes('passiveHolyPct') && engine.includes('maceBookMasteryBySize'), 'Cardinal specialized passives have combat consumers');
const capacity = passive.filter(s => s.passiveStat === 'capacityOnly');
assert.strictEqual(capacity.length, 4, 'four explicitly pending capacity-only skills remain');
for (const s of capacity) assert(/效果待實作；僅補技能容量/.test(s.desc), `${s.id} clearly discloses pending effect`);
const bioloSummons = passive.filter(s => s.jobId === 'biolo' && /^召喚/.test(s.name));
assert.strictEqual(bioloSummons.length, 4, 'four Biolo summon-named passives are present');
for (const s of bioloSummons) assert(/不會生成獨立召喚物/.test(s.desc), `${s.id} discloses no independent summon unit`);
const elementSummons = all.filter(s => s.jobId === 'element_master' && s.type === 'elemental_summon');
assert.strictEqual(elementSummons.length, 5, 'Element Master has five actual elemental summon actions');
console.log(`PASS ${jobs.length} fourth-job classes scanned (${all.length} skills; ${passive.length} passive records)`);
console.log(`PASS all passiveStat runtime handlers are present; ${special.length} Cardinal specialized passives have consumers`);
console.log(`PASS ${capacity.length} capacity-only passives remain explicitly marked pending (not faked)`);
console.log(`PASS ${bioloSummons.length} Biolo summon passives disclose no independent summon unit; ${elementSummons.length} Element Master summon actions remain active`);
