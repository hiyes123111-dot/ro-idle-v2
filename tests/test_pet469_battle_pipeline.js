const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const engine=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
function sliceBetween(a,b){const i=engine.indexOf(a);const j=engine.indexOf(b,i+1);if(i<0||j<0)throw new Error('missing engine source block '+a);return engine.slice(i,j);}
const checks=[];
const assert=(name,fn)=>{if(!fn())throw new Error('FAIL '+name);checks.push(name);};
const ctx={console,Date,Math,state:{pet:null,traitAlloc:{},stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},baseLevel:250,jobLevel:60,learnedSkills:{}},BASE_STAT_KEYS:['str','agi','vit','int','dex','luk'],ITEMS:{},effectiveGearBonuses:()=>({})};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';globalThis.ITEMS=ITEMS;',ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_457_pet_effect_completion.js'),'utf8'),ctx);
vm.runInContext(sliceBetween('function canonicalBonusKey(key)','function effectiveGearBonuses()')+
 sliceBetween('function getCardBonus(stat)','/* ---------------- 道具鎖定'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_469_pet_battle_pipeline.js'),'utf8'),ctx);

ctx.state.pet={eggId:'alice_egg',intimacy:950};
assert('MDEF passive bonus enters the same live combat bonus reader',()=>ctx.getCardBonus('mdef')===2);
assert('Demi-human damage reduction enters the combat bonus reader',()=>ctx.getCardBonus('raceDmgReduce_humanoid')===2);
assert('Direct pet stats are not duplicated into equipment/card bonus bucket',()=>ctx.getCardBonus('hit')===0&&ctx.getPetBonus('mdef')===2);
ctx.state.pet={eggId:'leaf_cat_egg',intimacy:950};
assert('Animal-type damage reduction enters the combat bonus reader',()=>ctx.getCardBonus('raceDmgReduce_brute')===5);
ctx.state.pet={eggId:'zherlthsh_egg',intimacy:950};
assert('Humanoid physical and magic bonuses are each applied exactly once',()=>ctx.getCardBonus('raceDmg_humanoid')===3&&ctx.getCardBonus('magicRaceDmg_humanoid')===3);
ctx.state.pet={eggId:'ancient_mummy_egg',intimacy:950};
assert('Dragon physical and magic bonuses are each applied exactly once',()=>ctx.getCardBonus('raceDmg_dragon')===6&&ctx.getCardBonus('magicRaceDmg_dragon')===6);
ctx.state.pet={eggId:'aliot_egg',intimacy:950};
assert('Attack delay and HIT passives are available in their correct pipelines',()=>ctx.getCardBonus('afterAttackDelayPct')===5&&ctx.getPetBonus('hit')===12&&ctx.getCardBonus('hit')===0);
ctx.state.pet={eggId:'alicel_egg',intimacy:950};
assert('Elemental magic damage passive enters combat bonus reader',()=>ctx.getCardBonus('magicEleDmg_none')===5);
assert('Unimplemented cast-time reduction is clearly labeled as not applied',()=>ctx.petBonusLabel().includes('變動詠唱縮短 5%（未套用）'));
ctx.state.pet={eggId:'aliot_egg',intimacy:950};
assert('Attack delay label explains that attack interval is shortened',()=>ctx.petBonusLabel().includes('攻擊間隔縮短 5%'));
ctx.state.pet.intimacy=500;
assert('Changing intimacy immediately recalculates the live pet bonus tier',()=>ctx.getPetBonus('hit')===6&&ctx.getCardBonus('afterAttackDelayPct')===3);
ctx.state.pet=null;
assert('Returning pet to egg removes every pet bonus from the live combat reader',()=>ctx.getCardBonus('mdef')===0&&ctx.getCardBonus('raceDmgReduce_brute')===0&&ctx.getPetBonus('hit')===0);
console.log(`v2.5.470 pet battle pipeline checks passed (${checks.length}):\n- `+checks.join('\n- '));
