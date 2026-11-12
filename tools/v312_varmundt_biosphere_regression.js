// v2.5.312 Varmundt Biosphere content integration regression
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={};vm.createContext(c);
vm.runInContext(fs.readFileSync('js/data.js','utf8')+'\nglobalThis.x={MONSTERS,ITEMS,MAPS,REGIONS};',c,{timeout:30000});
const {MONSTERS,ITEMS,MAPS,REGIONS}=c.x;
const groups={
 biosphere_grass:['spirit_g_land_s','spirit_g_land_m','spirit_g_land_l','spirit_g_land_sl','spirit_s_wind_s','spirit_s_wind_m','spirit_s_wind_l','spirit_s_wind_sl','spirit_f_land_s','spirit_f_land_m','spirit_f_land_l','spirit_f_land_sl'],
 biosphere_fire:['spirit_b_flame_s','spirit_b_flame_m','spirit_b_flame_l','spirit_b_flame_sl','spirit_c_flame_s','spirit_c_flame_m','spirit_c_flame_l','spirit_c_flame_sl','spirit_r_flame_s','spirit_r_flame_m','spirit_r_flame_l','spirit_r_flame_sl'],
 biosphere_ice:['spirit_i_water_s','spirit_i_water_m','spirit_i_water_l','spirit_i_water_sl','spirit_h_water_s','spirit_h_water_m','spirit_h_water_l','spirit_h_water_sl','spirit_c_water_s','spirit_c_water_m','spirit_c_water_l','spirit_c_water_sl'],
 biosphere_death:['spirit_d_wind_s','spirit_d_wind_m','spirit_d_wind_l','spirit_d_wind_sl','spirit_c_land_s','spirit_c_land_m','spirit_c_land_l','spirit_c_land_sl','spirit_c_wind_s','spirit_c_wind_m','spirit_c_wind_l','spirit_c_wind_sl']
};
const crystal={biosphere_grass:'grass',biosphere_fire:'flame',biosphere_ice:'ice',biosphere_death:'death'};
const gear={
 biosphere_grass:['barmund_plain_armor','plain_rune_armor','st_pinquicula_corsage'],
 biosphere_fire:['barmund_flame_armor','flame_rune_armor','st_orleans_gown','st_orleans_glove'],
 biosphere_ice:['ice_rune_armor','st_naga_armor','st_naga_shield','st_waterdrop_brooch'],
 biosphere_death:['barmund_armor','ice_s_r_suits2','soul_p_r_robe2','corrupt_p_r_cloth2']
};
const mapById=new Map(MAPS.map(m=>[m.id,m]));
const region=REGIONS.find(r=>r.id==='r_varmundt_biosphere');
assert(region,'biosphere region exists');
for(const [mapId,ids] of Object.entries(groups)){
 const map=mapById.get(mapId);assert(map,mapId+' exists');
 assert(region.maps.includes(mapId),mapId+' in region');
 for(const id of ids){
  const mon=MONSTERS[id];assert(mon,id+' monster exists');
  assert((map.monsters||[]).some(x=>(typeof x==='string'?x:x.id)===id),id+' appears in correct map');
  const drops=mon.drops||[];
  assert(drops.some(d=>d.item===crystal[mapId]),id+' crystal drop');
  for(const itemId of gear[mapId]){assert(ITEMS[itemId],itemId+' item exists');assert(drops.some(d=>d.item===itemId),id+' equipment/material drop '+itemId);}
 }
}
console.log('v2.5.312 Varmundt Biosphere integration: PASS (4 maps, 48 monsters, 4 crystals, 15 equipment/material sources)');
