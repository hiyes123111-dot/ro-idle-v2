const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const root = __dirname + '/..';
const context = { console, Date, Math, JSON, Object, Array, Set, Map, Number, String, RegExp,
  window: { addEventListener() {}, location: {} },
  document: { addEventListener() {}, getElementById(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];}, createElement(){return {};}, body:{classList:{add(){},remove(){}},appendChild(){}} }, navigator:{} };
context.window.window = context.window;
vm.createContext(context);
for (const file of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js'])
  vm.runInContext(fs.readFileSync(`${root}/js/${file}`,'utf8'), context, {filename:file});
const fourth = vm.runInContext(`Object.values(SKILLS).filter(s => /^v25_/.test(s.id))`, context);
const passive = fourth.filter(s => s.type === 'passive');
const engine = fs.readFileSync(`${root}/js/engine.js`,'utf8');
const handled = new Set([...engine.matchAll(/case '([^']+)'/g)].map(m=>m[1]));
// Ranger attack/trap proc effects are handled by dedicated runtime trigger loops, not the stat accumulator switch.
handled.add('rangerAttackProc'); handled.add('rangerTrapProc');
const unsupported = [...new Set(passive.map(s=>s.passiveStat).filter(Boolean))].filter(stat => !handled.has(stat));
assert.deepStrictEqual(unsupported, [], `fourth-job passive stats need runtime handlers: ${unsupported.join(', ')}`);
const vague = passive.filter(s => /對應能力|提升自身|強化自身/.test(s.desc));
assert.strictEqual(vague.length, 0, `vague passive descriptions: ${vague.map(s=>s.id).join(', ')}`);
const summonNames = ['召喚元素:阿爾多雷','召喚元素:普羅賽拉','召喚元素:迪盧比奧','召喚元素:泰雷莫圖斯','召喚元素:塞爾彭斯','召喚爬行者','召喚神木戰士','召喚神木妖精','召喚地獄樹'];
const summons = passive.filter(s=>summonNames.includes(s.name));
assert.strictEqual(summons.length, summonNames.length, 'all summon-named passives are present');
for (const s of summons) assert(/不會生成獨立召喚物/.test(s.desc), `${s.id} must disclose current summon limitation`);
const missingStat = passive.filter(s=>!s.passiveStat || !(/本作實際效果|被動技能：|被動陷阱：/.test(s.desc)));
assert.strictEqual(missingStat.length, 0, `passives need explicit runtime effect: ${missingStat.map(s=>s.id).join(', ')}`);
console.log(`PASS ${fourth.length} fourth-job skills scanned (${fourth.length-passive.length} active, ${passive.length} passive)`);
console.log(`PASS all ${new Set(passive.map(s=>s.passiveStat)).size} passive effect handlers exist in engine`);
console.log(`PASS ${passive.length} passive descriptions identify the implemented in-game effect`);
console.log(`PASS ${summons.length} summon-named passive skills disclose that no independent summon unit is created`);
