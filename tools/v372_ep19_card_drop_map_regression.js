const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={}; vm.createContext(c);
vm.runInContext(fs.readFileSync('js/data.js','utf8')+';globalThis.x={MONSTERS,CARDS,ITEMS,MAPS,REGIONS,MONSTER_CARD_DROPS,KINGDOMS};',c);
const {MONSTERS,CARDS,ITEMS,MAPS,REGIONS,MONSTER_CARD_DROPS,KINGDOMS}=c.x;
const cases=[
 ['ep19_aferde','aferde_card','mjo_wst01'],
 ['ep19_timbers','timbers_card','mjo_wst01'],
 ['ep19_lowest_rgan','lowest_rgan_card','jor_dun02'],
 ['ep19_middle_rgan','middle_g_rgan_card','jor_dun02']
];
const mapById=new Map(MAPS.map(m=>[m.id,m]));
const regionByMap=new Map(REGIONS.flatMap(r=>(r.maps||[]).map(id=>[id,r.id])));
for(const [mob,card,map] of cases){
 assert(MONSTERS[mob],`monster ${mob} exists`);
 assert(CARDS[card]&&ITEMS[card],`card ${card} exists in both registries`);
 assert.strictEqual(CARDS[card].monsterId,mob,`${card} points to ${mob}`);
 assert.strictEqual(MONSTER_CARD_DROPS[mob].card,card,`${mob} drop source`);
 assert.strictEqual(MONSTER_CARD_DROPS[mob].chance,0.0001,`${mob} card chance 0.01%`);
 assert(mapById.has(map),`map ${map} exists`);
 assert(mapById.get(map).monsters.some(x=>x.id===mob),`${mob} is listed on ${map}`);
 assert(regionByMap.has(map),`${map} is in a selectable region`);
}
assert(KINGDOMS.find(k=>k.id==='k_new_world').regions.includes('r_issgard'),'Issgard region is in the kingdom index');
assert(!MAPS.some(x=>x===undefined),'MAPS contains no sparse/undefined entries');
console.log(`v2.5.372 EP19 card source integration: PASS (${cases.length}/${cases.length})`);
