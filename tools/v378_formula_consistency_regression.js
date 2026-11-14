const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert');
const root=path.resolve(__dirname,'..');
const c={console,Math,Date,Set,Map,Array,Object,String,Number,JSON,window:{}};c.window=c;vm.createContext(c);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','engine.js'])
  vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),c,{filename:f,timeout:30000});
const out=vm.runInContext(`(() => {
  const rwcState={jobId:'assassincross',stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},equip:{accessory1:'rwc_2012_ring',accessory2:'rwc_2012_pendant'},instances:{},relics:{}};
  state=rwcState;_gearBonusCache=null;_gearBonusKey='';
  const rwc=effectiveGearBonuses();
  const slotted={jobId:'assassincross',stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},equip:{accessory1:'rwc_2012_ring_',accessory2:'rwc_2012_pendant_'},instances:{},relics:{}};
  state=slotted;_gearBonusCache=null;_gearBonusKey='';
  const rwc2=effectiveGearBonuses();
  return {rwc:{all:rwc.allTargetDmgPct||0,matk:rwc.matkPct||0},rwc2:{all:rwc2.allTargetDmgPct||0,matk:rwc2.matkPct||0},
    wind1:SKILLS.v25_wind_hawk_1.desc,wind5:SKILLS.v25_wind_hawk_5.desc};
})()`,c);
assert.deepStrictEqual(JSON.parse(JSON.stringify(out.rwc)),{all:5,matk:4});
assert.deepStrictEqual(JSON.parse(JSON.stringify(out.rwc2)),{all:5,matk:4});
assert(out.wind1.includes('140%～180%'),'Nature Friendly description matches live multiplier');
assert(out.wind5.includes('115%～140%'),'Calamity Wind description matches live multiplier');
console.log('v2.5.378 formula/description regression: PASS (RWC total bonuses and Wind Hawk multiplier descriptions)');
