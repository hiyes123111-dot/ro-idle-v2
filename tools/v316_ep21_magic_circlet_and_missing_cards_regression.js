// v2.5.316 EP21 magic circlet and MVP card integration regression
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=fs.readFileSync('js/data.js','utf8');
const c={};vm.createContext(c);
vm.runInContext(data+'\nglobalThis.x={ITEMS,CARDS,MONSTERS,MAPS,REGIONS,MONSTER_CARD_DROPS};',c,{timeout:30000});
const {ITEMS,CARDS,MONSTERS,MAPS,REGIONS,MONSTER_CARD_DROPS}=c.x;
const engine=fs.readFileSync('js/engine.js','utf8');
const crown=ITEMS.yorscalp_m_circlet;
assert(crown,'Judgment Circlet item exists');
assert.deepStrictEqual(JSON.parse(JSON.stringify(crown.per2Refine)),{hp:300,sp:50});
assert.deepStrictEqual(JSON.parse(JSON.stringify(crown.per3Refine)),{allSizeMagicDmgPct:5});
assert.deepStrictEqual(JSON.parse(JSON.stringify(crown.per4Refine)),{matkPct:5});
const cond=crown.condBonus;
const refine10=cond.find(x=>x.when.refineMin===10);
assert.equal(refine10.bonus.afterAttackDelayPct,10,'+10 attack delay reduction uses positive engine convention');
assert(cond.some(x=>x.when.refineMin===7&&x.bonus.allEleDmg===10));
assert(cond.some(x=>x.when.refineMin===9&&x.bonus.sMatk===8));
assert(cond.some(x=>x.when.itemGradeMin==='D'&&x.bonus.sMatk===7));
assert(cond.some(x=>x.when.itemGradeMin==='B'&&x.bonus.allRaceDmgPct===15));
assert(engine.includes("getCardBonus('afterAttackDelayPct')"),'attack interval consumes afterAttackDelayPct');
assert(engine.includes("getCardBonus('allSizeMagicDmgPct')"),'magic damage consumes all-size magic damage');
assert(engine.includes("getCardBonus('allEleDmg')"),'magic damage consumes all-element magic damage');
assert(engine.includes("getCardBonus('sMatk')"),'magic damage consumes S.MATK');
assert(engine.includes("getCardBonus('matkPct')"),'derived MATK consumes MATK percent');
for(const [id,mid,slot] of [['ktullanux_card','ktullanux','armor'],['mistress_card','mistress','headgear']]){
 assert(ITEMS[id],id+' item exists');assert(CARDS[id],id+' card data exists');
 assert.equal(CARDS[id].monsterId,mid);assert.equal(CARDS[id].slot,slot);
 assert(MONSTERS[mid],mid+' monster exists');assert(MONSTER_CARD_DROPS[mid]&&MONSTER_CARD_DROPS[mid].card===id,mid+' drop mapping');
}
assert.equal(CARDS.ktullanux_card.bonus.eleDmg_fire,50);
assert.equal(CARDS.mistress_card.bonus.spCostPct,25);
assert(MAPS.some(m=>m.id==='ice_dun03')&&MAPS.some(m=>m.id==='mjolnir_04'));
assert(!REGIONS.some((r,i)=>REGIONS.findIndex(x=>x.id===r.id)!==i),'region ids unique after syntax repair');
console.log('v2.5.316 Judgment Circlet + MVP cards: PASS (6 supported magic stats, 2 new MVP cards, valid map/region data)');
