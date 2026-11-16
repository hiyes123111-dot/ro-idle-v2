const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'js/v2_5_444_poplab_flower_and_23rd_cards.js'),'utf8');
const ctx={CARDS:{},ITEMS:{},window:{},invalidateCodexPoolCache(){ctx.invalidated=true;}};
vm.createContext(ctx);vm.runInContext(src,ctx);
const expected={
  tulip_card:[300649,'accessory'], marigold_card:[300650,'accessory'], bluebell_card:[300651,'accessory'],
  half_lotus_card:[300652,'accessory'], forget_me_not_card:[300653,'accessory'], anemone_card:[300654,'accessory'],
  anniversary_23_enchant:[300713,'all']
};
for(const [id,[imgId,slot]] of Object.entries(expected)){
  assert(ctx.CARDS[id],`CARDS entry ${id}`); assert(ctx.ITEMS[id],`ITEMS entry ${id}`);
  assert.strictEqual(ctx.CARDS[id].imgId,imgId,`${id} official ID`);
  assert.strictEqual(ctx.CARDS[id].slot,slot,`${id} slot`);
  assert.strictEqual(ctx.ITEMS[id].imgId,imgId,`${id} item official ID`);
  assert.strictEqual(ctx.ITEMS[id].codexInclude,true,`${id} codex inclusion`);
  assert.strictEqual(ctx.CARDS[id].addedVersion,'v2.5.444',`${id} release tag`);
  assert(ctx.window.CARD_ART_FALLBACKS[id],`${id} art fallback`);
}
assert.strictEqual(ctx.CARDS.tulip_card.bonus.variableCastPct,-5);
assert.strictEqual(ctx.CARDS.half_lotus_card.bonus.variableCastPct,5);
assert(ctx.CARDS.half_lotus_card.condBonus[0].when.withCards.includes('tulip_card'));
assert(ctx.CARDS.marigold_card.condBonus[0].when.withCards.includes('forget_me_not_card'));
assert(ctx.CARDS.bluebell_card.condBonus[0].when.withCards.includes('anemone_card'));
assert.strictEqual(ctx.CARDS.anniversary_23_enchant.catalogCard,true);
const engine=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
assert(engine.includes("card.catalogCard === true && card.slot === 'all'"),'all-slot enchant is blocked from normal card sockets');
assert(engine.includes('全欄位附魔（附魔槽尚未支援）'),'codex label explains unsupported enchant socket');
assert.strictEqual(ctx.invalidated,true);
console.log('PASS 7 cards have CARDS/ITEMS, official IDs, codex inclusion and image fallbacks');
console.log('PASS flower card standalone bonuses and three paired-card effects are registered');
console.log('PASS 23rd anniversary card is registered as all-slot enchant');
console.log('PASS all-slot enchant cannot be inserted into ordinary card sockets');
console.log('4/4 passed');
