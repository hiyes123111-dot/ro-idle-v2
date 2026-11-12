// v2.5.311 map/card source integration regression
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={};vm.createContext(c);
vm.runInContext(fs.readFileSync('js/data.js','utf8')+';globalThis.x={MONSTERS,CARDS,ITEMS,MAPS,REGIONS,MVP_MAP_DATA,MONSTER_CARD_DROPS};',c);
const {MONSTERS,CARDS,ITEMS,MAPS,REGIONS,MVP_MAP_DATA,MONSTER_CARD_DROPS}=c.x;
const checks=[
 ['randel','randel_card','lhz_dun04'],
 ['flamel','flamel_card','lhz_dun04'],
 ['celia','ceila_card','lhz_dun04'],
 ['chen','chen_card','lhz_dun04'],
 ['gertie','gertie_card','lhz_dun04'],
 ['alphoccio','alphoccio_card','lhz_dun04'],
 ['trentini','trentini_card','lhz_dun04'],
 ['watcher','watcher_card','prt_prison'],
 ['ill_drainliar','matt_drainliar_card','gef_d01_i'],
 ['wild_rider','wild_rider_card','mal_dun01'],
 ['dr_eggring','eggring_card','novice_dr_field'],
 ['dr_lunatic','leaf_lunatic_card','novice_dr_field'],
 ['dr_fabre','grass_fabre_card','novice_dr_field'],
 ['dr_hornet','wild_honet_card','novice_dr_field'],
 ['dr_roda_frog','sw_roda_frog_card','novice_dr_field'],
 ['dr_desert_wolf_b','hunter_wolf_card','novice_dr_field'],
 ['dr_spore','trance_spore_card','novice_dr_field'],
 ['boiled_rice','lucky_riceball_c','festival_rice_field']
];
const mapById=new Map(MAPS.map(m=>[m.id,m]));
const regions=REGIONS.flatMap(r=>r.maps||[]);
for(const [mon,card,map] of checks){
 assert(MONSTERS[mon],mon+' monster exists');
 assert(CARDS[card]&&ITEMS[card],card+' card exists');
 assert.strictEqual(CARDS[card].monsterId,mon,card+' source');
 assert(MONSTER_CARD_DROPS[mon]&&MONSTER_CARD_DROPS[mon].card===card,mon+' drop map');
 assert(mapById.has(map),map+' map exists');
 assert((mapById.get(map).monsters||[]).some(x=>(typeof x==='string'?x:x.id)===mon),mon+' map spawn');
 assert(regions.includes(map),map+' belongs to selectable region');
}
assert(MVP_MAP_DATA.mal_dun01.includes('wild_rider'),'Wild Rider mini-boss spawn mapping');
console.log(`v2.5.311 map/card source integration: PASS (${checks.length}/${checks.length})`);
