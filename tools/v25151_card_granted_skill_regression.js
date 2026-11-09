// v2.5.151 card-granted skill regression
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('js/data.js', 'utf8');
const skillsSrc = fs.readFileSync('js/skills.js', 'utf8');
const ctx = { console, window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(src + '; globalThis.__cards = CARDS;', ctx, { timeout: 30000 });
vm.runInContext(skillsSrc + '; globalThis.__skills = SKILLS;', ctx, { timeout: 30000 });
const cards = ctx.__cards, skills = ctx.__skills;
function assert(ok, msg) { if (!ok) throw new Error(msg); }
const expected = {
  ceila_card: ['sa_abracadabra', 1],
  chen_card: ['mo_callspirits', 2],
  gertie_card: ['rg_closeconfine', 1]
};
for (const [cardId, [skillId, lv]] of Object.entries(expected)) {
  const card = cards[cardId];
  assert(card, `missing card ${cardId}`);
  assert(card.grantSkill && card.grantSkill.some(g => g.id === skillId && g.lv === lv), `${cardId} does not grant ${skillId} Lv${lv}`);
  assert(skills[skillId], `missing skill definition ${skillId}`);
  assert(lv <= (skills[skillId].maxLv || 1), `${cardId} grants level above skill max`);
}
console.log('v2.5.151 card-granted skill regression: PASS');
