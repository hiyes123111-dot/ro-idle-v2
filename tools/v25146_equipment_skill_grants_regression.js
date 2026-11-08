// v2.5.146: equipment/card granted active skills must be declared in data and resolve to real skills.
const fs = require('fs');
const vm = require('vm');
const data = fs.readFileSync('js/data.js', 'utf8');
const skills = fs.readFileSync('js/skills.js', 'utf8');
const skillContext = {};
vm.createContext(skillContext);
vm.runInContext(skills + '\n;globalThis.__skills = SKILLS;', skillContext, { timeout: 30000 });
const SKILLS = skillContext.__skills;
const context = {};
vm.createContext(context);
vm.runInContext(data + '\n;globalThis.__items = ITEMS; globalThis.__cards = CARDS;', context, { timeout: 30000 });
const { __items: ITEMS, __cards: CARDS } = context;
const expectedItems = {
  cutlas_: [['bash', 5]], all_in_one_ring: [['heal', 1]],
  mother_heart: [['autoguard', 3], ['heal', 1]], zaha_doll_hat: [['magnificat', 1]],
  old_parasol: [['soulstrike', 10]], amistrbag_greed: [['greed', 1]],
  amistrbag_incagi: [['increaseagi', 1]], amistrbag_hiding: [['hiding', 1]],
  amistrbag_magnum: [['magnumbreak', 1]], amistrbag_endure: [['endure', 1]],
  amistrbag_concentrate: [['improveconc', 1]], bravery_bag: [['greed', 1]],
  gyges_ring: [['hiding', 1]],
};
const expectedCards = {
  shinobi_card: [['cloaking', 5]],
  kraken_card: [['hiding', 1], ['rg_backstap', 1]],
  giant_octopus_card: [['waterball', 5]],
  randel_card: [['autoguard', 3]],
  anger_moonlight_card: [['pa_pressure', 4]],
};
let failed = 0;
function check(group, obj, expected) {
  for (const [id, grants] of Object.entries(expected)) {
    const actual = obj[id] && obj[id].grantSkill;
    const ok = Array.isArray(actual) && grants.every(([skill, lv]) => actual.some(g => g.id === skill && g.lv === lv));
    console.log(`${ok ? 'PASS' : 'FAIL'} ${group} ${id} grants ${grants.map(x => x.join(' Lv')).join(', ')}`);
    if (!ok) failed++;
  }
}
check('ITEM', ITEMS, expectedItems);
check('CARD', CARDS, expectedCards);
for (const [id, grants] of [...Object.entries(expectedItems), ...Object.entries(expectedCards)]) {
  for (const [skill] of grants) {
    if (!SKILLS[skill]) { console.log(`FAIL skill definition missing: ${skill}`); failed++; }
  }
}
console.log(`\nv2.5.146 equipment/card skill grants: ${18 - failed}/18 checks passed.`);
process.exitCode = failed ? 1 : 0;
