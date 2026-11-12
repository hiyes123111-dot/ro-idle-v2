const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ctx = { console, window: {} };
vm.createContext(ctx);
for (const file of ['js/skills.js','js/monster_skills.js','js/jobs.js','js/data.js','js/relics.js','js/v2_content.js','js/v2_4_content.js','js/v2_5_content.js','js/v2_6_skill_migration.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'), ctx, {timeout:30000, filename:file});
}
vm.runInContext('globalThis.__ITEMS=ITEMS;globalThis.__CARDS=CARDS;globalThis.__SKILLS=SKILLS;',ctx);
const I = ctx.__ITEMS, S = ctx.__SKILLS;
const assert = (ok,msg) => { if(!ok) throw new Error(msg); console.log('PASS',msg); };
const weapon = I.thanos_tsword_ad;
assert(!!weapon, 'Thanos AD sword item exists');
assert(weapon.condBonus.some(x=>x.when?.refineMin===9 && x.bonus?.autoSpellWindcutter===5), 'Thanos AD sword +9 configures provisional 5% Wind Cutter proc');
assert(!!S.rk_windcutter && S.rk_windcutter.maxLv===5, 'Wind Cutter skill ID resolves and supports Lv1-5');
const engine = fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
assert(engine.includes("'thanos_tsword_ad:autoSpellWindcutter': { skill: 'rk_windcutter', lv: 2, melee: true, useLearnedLv: true }"), 'engine maps Thanos AD sword proc to Wind Cutter and learned level');
assert(/useLearnedLv:\s*!!meta\.useLearnedLv/.test(engine), 'conditional autocast preserves learned-level behavior');
assert(/if \(e\.useLearnedLv\)[\s\S]{0,180}skillLv\(e\.skill\)/.test(engine), 'autocast uses learned skill level when higher than Lv2');
assert(/tryAutoSpells\('attack', target\)/.test(engine), 'normal physical attack invokes weapon autocast pipeline');
assert(/hpAmount === 2500 && spAmount === 50 \? 3/.test(engine), 'Thanos AD 2500 HP / 50 SP recovery uses the configured 3% chance');
assert(/tryItemRecoveryProcs\('attack'\)/.test(engine), 'normal physical hit invokes queued HP/SP recovery proc');
assert(/ticks: 4/.test(engine) && /nextAt: now \+ 1000/.test(engine), 'weapon recovery schedules four one-second ticks');
assert(/if \(useMag\) \{ tryAutoSpells\('magic', target\)/.test(engine), 'magic attacks invoke magic autocast pipeline');
// Audit every direct autoSpell reference in the item/card database against the merged skill registry.
let refs=[];
for (const [id,item] of Object.entries(I)) for (const e of item.autoSpell||[]) refs.push({owner:id,skill:e.skill});
for (const [id,card] of Object.entries(ctx.__CARDS||{})) for (const e of card.autoSpell||[]) refs.push({owner:id,skill:e.skill});
const missing=refs.filter(x=>!S[x.skill]);
assert(missing.length===0, `all direct item/card autoSpell skill refs resolve (${refs.length} refs)`);
console.log(`SUMMARY ITEMS=${Object.keys(I).length} CARDS=${Object.keys(ctx.__CARDS||{}).length} AUTOSPELL_REFS=${refs.length}`);
