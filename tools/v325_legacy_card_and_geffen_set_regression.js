const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') + '\nglobalThis.__ITEMS=ITEMS;globalThis.__CARDS=CARDS;globalThis.__MONSTERS=MONSTERS;globalThis.__DROPS=MONSTER_CARD_DROPS;', ctx, { timeout: 30000 });
const I = ctx.__ITEMS, C = ctx.__CARDS;
const assert = (ok, msg) => { if (!ok) throw new Error(msg); console.log('PASS', msg); };
for (const id of ['nidhogg_shadow_card','nahtzigger_card']) {
  assert(!!I[id], `${id} has item record`);
  assert(!!C[id], `${id} has card record`);
  assert(I[id].imgId === C[id].imgId || (I[id].imgId === (id==='nidhogg_shadow_card'?4456:4457)), `${id} image ID mapped`);
  assert(C[id].slot === 'armor', `${id} armor slot`);
}
assert(C.nidhogg_shadow_card.bonus.int === 5, 'Nidhogg Shadow Card INT +5');
assert(C.nidhogg_shadow_card.fixedCastPct === -50, 'Nidhogg Shadow Card fixed-cast metadata -50%');
assert(C.nahtzigger_card.bonus.magicEleDmg_ghost === 30, 'Nahtzigger Card ghost-element magic damage +30%');
assert(ctx.__DROPS.naght_sieger.card === 'nahtzigger_card' && ctx.__DROPS.naght_sieger.chance === 0.0001, 'Naght Sieger 0.01% card drop configured');
for (const id of ['md_geffen_hood','md_geffen_hood2','md_geffen_hood3']) {
  assert(I[id].condBonus.some(x => (x.when.withAnyItem||[]).includes('md_geffen_robe')), `${id} recognizes Magic Protector Robe pairing`);
}
assert(I.md_geffen_hood4.condBonus.some(x => (x.when.withAnyItem||[]).includes('md_geffen_robe')), 'md_geffen_hood4 recognizes Magic Protector Robe pairing');
assert(I.md_geffen_hood.per3Refine.afterAttackDelayPct === 2, 'Magic Barrier Manteau refine +3 attack delay scaling');
assert(I.md_geffen_hood2.per3Refine.variableCastPct === 2, 'Magic Barrier Muffler refine +3 variable cast scaling');
assert(I.md_geffen_hood4.condBonus.some(x => x.when.refineMin === 9 && x.bonus.allSizeMagicDmgPct === 3), 'Violent Magic Muffler refine +9 physical/magic size damage');
assert(I.md_geffen_robe.name === '魔法護符長袍 [1]', 'Magic Protector Robe localized name aligned');
let missingCardRefs=[];
for (const [id,d] of Object.entries(I)) for (const cb of d.condBonus||[]) for (const ref of (cb.when||{}).withCards||[]) if(!C[ref]) missingCardRefs.push(`${id}->${ref}`);
assert(missingCardRefs.length===0, `all equipment withCards references resolve (${Object.keys(C).length} cards)`);
console.log(`SUMMARY ITEMS=${Object.keys(I).length} CARDS=${Object.keys(C).length}`);
