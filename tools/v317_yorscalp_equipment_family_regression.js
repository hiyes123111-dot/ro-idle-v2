// v2.5.317 Yorscalp equipment family integration regression
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={};vm.createContext(c);
vm.runInContext(fs.readFileSync('js/data.js','utf8')+';globalThis.x={ITEMS};',c,{timeout:30000});
const I=c.x.ITEMS;
const expected={
 yorscalp_p_circlet:'headgear',yorscalp_m_circlet:'headgear',
 yorscalp_armor:'armor',yorscalp_robe:'armor',
 yorscalp_manteau:'garment',yorscalp_muffler:'garment',
 yorscalp_boots:'footgear',yorscalp_shoes:'footgear',
 yorscalp_ring:'accessory',yorscalp_glove:'accessory',
 yorscalp_earring:'accessory',yorscalp_necklace:'accessory'
};
for(const [id,slot] of Object.entries(expected)){
 assert(I[id],id+' exists');
 assert.equal(I[id].type,'armor',id+' is equippable armor');
 assert.equal(I[id].armorType,slot,id+' maps to correct equipment slot');
}
assert.equal(I.yorscalp_armor.atk,130,'armor base ATK');
assert.equal(I.yorscalp_robe.matk,130,'robe base MATK');
assert.equal(I.yorscalp_manteau.per2Refine.atkPct,1,'manteau refine bonus');
assert.equal(I.yorscalp_muffler.per2Refine.matkPct,1,'muffler refine bonus');
assert.equal(I.yorscalp_boots.hpPct,10,'boots HP bonus');
assert.equal(I.yorscalp_shoes.hpPct,10,'shoes HP bonus');
const has=(id,item)=> (I[id].condBonus||[]).some(x=>(x.when.withAnyItem||x.when.withItems||[]).includes(item));
assert(has('yorscalp_armor','yorscalp_manteau'),'physical armor+manteau combo');
assert((I.yorscalp_armor.condBonus||[]).some(x=>(x.when.withItems||[]).includes('yorscalp_boots')),'physical 3-piece combo');
assert(has('yorscalp_robe','yorscalp_muffler'),'magic robe+muffler combo');
assert((I.yorscalp_robe.condBonus||[]).some(x=>(x.when.withItems||[]).includes('yorscalp_shoes')),'magic 3-piece combo');
assert(has('yorscalp_p_circlet','yorscalp_ring')&&has('yorscalp_p_circlet','yorscalp_glove'),'execution circlet accessory combos');
assert(has('yorscalp_m_circlet','yorscalp_earring')&&has('yorscalp_m_circlet','yorscalp_necklace'),'judgment circlet accessory combos');
assert(has('yorscalp_ring','yorscalp_glove'),'ring+glove combo');
assert(has('yorscalp_earring','yorscalp_necklace'),'earring+necklace combo');
const eng=fs.readFileSync('js/engine.js','utf8');
assert(eng.includes("getCardBonus('allElePhysDmgPct')"),'physical all-element bonus consumed by damage pipeline');
assert(eng.includes("'allElePhysDmgPct'"),'physical all-element bonus is recognized');
for(const id of ['yorscalp_p_circlet','yorscalp_m_circlet']){
 const line=fs.readFileSync('js/data.js','utf8').split('\n').find(x=>x.startsWith('  "'+id+'":'));
 assert.equal((line.match(/"condBonus":/g)||[]).length,1,id+' has one condition list');
}
console.log('v2.5.317 Yorscalp equipment family: PASS (12/12 wearable items, refine/grade and set links)');
