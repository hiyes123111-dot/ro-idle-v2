const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const skillsSrc = read('js/skills.js');
const jobsSrc = read('js/jobs.js');
const engineSrc = read('js/engine.js');
const dataSrc = read('js/data.js');
function assert(ok, msg) { if (!ok) throw new Error(msg); }
const skillCtx = {};
vm.runInNewContext(skillsSrc + '\nglobalThis.__skills = SKILLS;', skillCtx);
const SKILLS = skillCtx.__skills;
assert(SKILLS.sn_falconassault, 'Sniper Falcon Assault skill must be registered');
assert(SKILLS.sn_falconassault.name.includes('獵鷹突擊'), 'Active skill must be named 獵鷹突擊');
assert(SKILLS.sn_falconassault.type === 'damage', 'Falcon Assault must be an active single-target damage skill');
assert(SKILLS.sn_falconassault.requires.skillId === 'blitzbeat', 'Falcon Assault prerequisite must be Blitz Beat');
assert(Array.isArray(SKILLS.blitzbeat.passiveMult), 'Blitz Beat passive multiplier must remain separate');
assert(SKILLS.blitzbeat.type === 'damage_aoe' && SKILLS.blitzbeat.alwaysHit, 'Blitz Beat active effect must remain AOE and always-hit');
const jobCtx = { SKILLS: new Proxy({}, { get: (_, id) => ({ id }) }) };
vm.runInNewContext(jobsSrc + '\nglobalThis.__jobs = JOB_TREE;', jobCtx);
assert(jobCtx.__jobs.sniper.skills.some(s => (typeof s === 'string' ? s : s.id) === 'sn_falconassault'), 'Sniper job must expose Falcon Assault');
for (const id of ['hunter','bard','dancer','clown','gypsy']) assert(jobCtx.__jobs[id], `Archer family job ${id} must remain`);
assert(engineSrc.includes('Math.min(30, 5 + (luk - 1) * 25 / 119)'), 'Blitz Beat LUK proc formula must be preserved');
assert(engineSrc.includes('bbSkill.passiveMult[bbLv - 1]'), 'Passive proc must use passiveMult');
assert(engineSrc.includes('獵鷹突襲！') && engineSrc.includes("sk.id === 'sn_falconassault'"), 'Passive and active Falcon names/hooks must be distinct');
const dataCtx = {};
vm.runInNewContext(dataSrc + '\nglobalThis.__items = ITEMS;', dataCtx);
const I = dataCtx.__items;
const expected = {
  modify_str_boots_: { atk: 7 },
  modify_int_boots_: { matk: 10 },
  modify_agi_boots_: { aspdPct: 3 },
  modify_vit_boots_: { hp: 300 },
  modify_dex_boots_: { dex: 3 },
  modify_luk_boots_: { critDmgPct: 2 }
};
for (const [id, bonus] of Object.entries(expected)) {
  assert(I[id] && I[id].per3Refine, `${id} must have per3Refine data`);
  for (const [k,v] of Object.entries(bonus)) assert(I[id].per3Refine[k] === v, `${id} per3Refine.${k} expected ${v}`);
}
for (const key of ['perRefine','perRefineSquare','per2Refine','per2RefineExtra','per3Refine','per4Refine','per5Refine','perRefineSquareMatk','perRefineSquareMatkHalf']) {
  assert(engineSrc.includes(`if (def.${key})`), `Engine must apply ${key}`);
}
assert(engineSrc.includes('when.refineMin') && engineSrc.includes('when.refineMax'), 'Refine threshold conditions must be evaluated');
console.log('PASS v25546_archer_refine_regression.js');
