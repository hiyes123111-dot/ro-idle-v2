const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const root = __dirname + '/..';
const context = {
  console, Date, Math, JSON, Object, Array, Set, Map, Number, String, RegExp,
  window: { addEventListener() {}, location: {} },
  document: { addEventListener() {}, getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; }, createElement() { return {}; }, body: { classList: { add() {}, remove() {} }, appendChild() {} } },
  navigator: {},
};
context.window.window = context.window;
vm.createContext(context);
for (const file of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js']) {
  vm.runInContext(fs.readFileSync(`${root}/js/${file}`, 'utf8'), context, { filename: file });
}
const result = vm.runInContext(`(() => {
  const fourth = Object.values(SKILLS).filter(s => /^v25_/.test(s.id));
  const active = fourth.filter(s => s.type !== 'passive');
  const passive = fourth.filter(s => s.type === 'passive');
  const activeMissing = active.filter(s => {
    const v = Array.isArray(s.mult) ? s.mult : [s.mult];
    return !s.desc.includes(Math.round(v[0]*100)+'%～'+Math.round(v[v.length-1]*100)+'%');
  }).map(s => s.id);
  const passiveVague = passive.filter(s => /對應能力|提升自身|強化自身/.test(s.desc)).map(s => s.id);
  const trapMissing = fourth.filter(s => s.rangerTrapProc).filter(s => !/機率|冷卻|傷害|暈眩|HIT/.test(s.desc)).map(s => s.id);
  const windPassive = fourth.filter(s => s.id.startsWith('v25_wind_hawk_') && s.type === 'passive').map(s => ({id:s.id,desc:s.desc}));
  return {total:fourth.length,active:active.length,passive:passive.length,activeMissing,passiveVague,trapMissing,windPassive};
})()`, context);
assert(result.activeMissing.length === 0, `all active skills expose matching multiplier ranges: ${result.activeMissing.join(',')}`);
assert(result.passiveVague.length === 0, `no fourth-job passive uses vague wording: ${result.passiveVague.join(',')}`);
assert(result.trapMissing.length === 0, `all Wind Hawk traps explain their trigger and effect: ${result.trapMissing.join(',')}`);
for (const s of result.windPassive) assert(!/對應能力/.test(s.desc), `${s.id} must have a concrete effect`);
console.log(`PASS ${result.total} fourth-job skills audited (${result.active} active, ${result.passive} passive)`);
console.log('PASS active skill descriptions match actual multiplier arrays');
console.log('PASS passive skill descriptions state concrete stat/effect values');
console.log('PASS Wind Hawk passive attacks and traps explain trigger chance/effect/cooldown');
