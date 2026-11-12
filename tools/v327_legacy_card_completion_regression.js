// v2.5.327: older card combo and learned-level autocast regression
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ctx = { console, window: {} };
vm.createContext(ctx);
for (const file of ['js/skills.js','js/monster_skills.js','js/jobs.js','js/data.js','js/relics.js','js/v2_content.js','js/v2_4_content.js','js/v2_5_content.js','js/v2_6_skill_migration.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { timeout: 30000, filename: file });
}
vm.runInContext('globalThis.__x={ITEMS,CARDS,SKILLS}', ctx);
const { ITEMS, CARDS, SKILLS } = ctx.__x;
const assert = (v, m) => { if (!v) throw new Error(m); console.log('PASS', m); };
assert(ITEMS.zealotus_card?.imgId === 4277, 'Zealotus Card item entry and image ID exist');
assert(CARDS.zealotus_card?.slot === 'shield', 'Zealotus Card is assigned to shield slot');
assert(CARDS.zealotus_card.bonus.luk === 2, 'Zealotus Card grants LUK +2');
assert(CARDS.zealotus_card.bonus.skillDmg_ba_musicalstrike === 10, 'Zealotus Card boosts Musical Strike by 10%');
assert(CARDS.zealotus_card.bonus.skillDmg_cg_arrowvulcan === 10, 'Zealotus Card boosts Arrow Vulcan by 10%');
assert(CARDS.injustice_card.condBonus.some(x => x.when.withCards.includes('zealotus_card') && x.bonus.atk === 20 && x.bonus.luk === 3), 'Injustice + Zealotus set grants ATK +20 and LUK +3');
assert(!CARDS.injustice_card.unimplemented, 'Injustice + Zealotus combo no longer marked unimplemented');
assert(CARDS.violy_card.autoSpell.some(x => x.skill === 'frostjoke' && x.chance === 2 && x.useLearnedLv), 'Violy Card uses 2% proc and learned Frost Joke level');
assert(!CARDS.violy_card.unimplemented, 'Violy learned-level effect no longer marked unimplemented');
assert(SKILLS.ba_musicalstrike && SKILLS.cg_arrowvulcan && SKILLS.frostjoke, 'all referenced skills resolve');
assert(fs.existsSync(path.join(root, 'images/items/14277.png')), 'Zealotus card image exists');
console.log(`SUMMARY ITEMS=${Object.keys(ITEMS).length} CARDS=${Object.keys(CARDS).length}`);
