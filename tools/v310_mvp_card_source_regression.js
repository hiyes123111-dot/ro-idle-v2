// v2.5.310：MVP／特殊怪物卡片來源與圖鑑可追溯性
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const src = fs.readFileSync('js/data.js', 'utf8') + '\nglobalThis.__a={ITEMS,CARDS,MONSTERS,MAPS,MVP_MAP_DATA,MONSTER_CARD_DROPS};';
const ctx = {}; vm.createContext(ctx); vm.runInContext(src, ctx, {timeout:30000});
const {ITEMS,CARDS,MONSTERS,MAPS,MVP_MAP_DATA,MONSTER_CARD_DROPS}=ctx.__a;
const cases = [
  ['baphomet','baphomet_real_card','gefenia01','mvp'],
  ['kiel_','kiel_card','kh_dun02','mvp'],
  ['holy_skogul','holy_skogul_card','odin_tem03','mini'],
  ['queen_scaraba','q_scaraba_card','dic_dun03','mvp'],
  ['b_seyren','b_seyren_card','lhz_tomb_fallen','mvp'],
  ['b_eremes','b_eremes_card','lhz_tomb_fallen','mvp'],
  ['b_harword','b_harword_card','lhz_tomb_fallen','mvp'],
  ['b_magaleta','b_magaleta_card','lhz_tomb_fallen','mvp'],
  ['b_shecil','b_shecil_card','lhz_tomb_fallen','mvp'],
  ['b_katrinn','b_katrinn_card','lhz_tomb_fallen','mvp'],
  ['thanatos','thanatos_card','tha_t12','mvp']
];
for (const [monster,card,map,kind] of cases) {
  assert(MONSTERS[monster], `${monster}: monster exists`);
  assert(CARDS[card] && ITEMS[card], `${card}: card and item exist`);
  assert.strictEqual(CARDS[card].monsterId, monster, `${card}: card source matches`);
  assert(MONSTER_CARD_DROPS[monster], `${monster}: card drop mapping exists`);
  assert.strictEqual(MONSTER_CARD_DROPS[monster].card, card, `${monster}: correct card drop`);
  assert(MVP_MAP_DATA[map] && MVP_MAP_DATA[map].includes(monster), `${monster}: assigned to ${map}`);
  assert(MAPS.some(m => m.id === map), `${map}: selectable map exists`);
  if (kind === 'mvp') assert(MONSTERS[monster].isMvp, `${monster}: MVP spawn category`);
  else assert(!MONSTERS[monster].isMvp, `${monster}: mini-boss spawn category`);
}
console.log(`v2.5.310 monster/card source audit: PASS (${cases.length}/${cases.length})`);
