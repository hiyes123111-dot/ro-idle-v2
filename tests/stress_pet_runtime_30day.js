const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
let now=Date.UTC(2026,0,1), saves=0, throttled=0, logs=[];
class FakeDate extends Date { static now(){return now;} }
const ctx={
 console,Date:FakeDate,Math,
 state:{pet:null,petRecords:{},inventory:[],gold:100000000,hp:100,maxHp:100,sp:100,maxSp:100},
 getItemQty(id){return ctx.state.inventory.filter(x=>x.item===id).reduce((n,x)=>n+x.qty,0);},
 removeItem(id,n){const row=ctx.state.inventory.find(x=>x.item===id&&x.qty>=n);if(!row)return false;row.qty-=n;if(!row.qty)ctx.state.inventory=ctx.state.inventory.filter(x=>x!==row);return true;},
 addItem(id,n){const row=ctx.state.inventory.find(x=>x.item===id);if(row)row.qty+=n;else ctx.state.inventory.push({item:id,qty:n});},
 buyPetMerchantItem(id,n){return false;},logMsg(m){logs.push(m);},saveGame(){saves++;return true;},saveGameThrottled(){throttled++;return true;},
 recomputeDerived(){},refreshPetCenterIfOpen(){},renderInventoryTab(){},renderPetCenter(){},renderTopBar(){},
 activeTab:'',invCategory:'',effectiveGearBonuses:()=>({})
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';globalThis.ITEMS=ITEMS;',ctx);
for(const f of ['v2_5_456_pet_system.js','v2_5_457_pet_effect_completion.js','v2_5_458_pet_trigger_skills.js','v2_5_459_pet_proc_completion.js','v2_5_468_pet_proc_accuracy.js','v2_5_472_pet_combat_proc_completion.js','v2_5_473_pet_offline_care.js'])
 vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f});
const checks=[];
function check(name,fn){if(!fn())throw new Error('FAIL '+name);checks.push(name);}
// 30 simulated days in 8-hour bounded catch-up chunks; no feed should safely return the pet.
ctx.state.inventory=[{item:'poring_egg',qty:1},{item:'pet_incubator',qty:1}];
check('Initial pet hatch works',()=>ctx.hatchPet('poring_egg',false)===true);
ctx.state.pet.intimacy=950;ctx.state.pet.hunger=100;ctx.state.pet.autoFeed=false;ctx.state.pet.lastCareAt=now;
for(let day=0;day<30;day++){
  for(let block=0;block<3;block++){
    now+=8*60*60000;
    if(ctx.state.pet)ctx.tickPetCare();
  }
}
check('30-day unattended pet is safely returned without loss',()=>ctx.state.pet===null&&ctx.getItemQty('poring_egg')===1&&ctx.state.petRecords.poring_egg?.length===1);
check('Returned pet profile remains finite and bounded',()=>{
 const p=ctx.state.petRecords.poring_egg[0];return p.petUid&&Number.isFinite(p.intimacy)&&p.intimacy>=0&&p.intimacy<=1000&&Number.isFinite(p.hunger)&&p.hunger>=0&&p.hunger<=100;
});
// Repeated save/restore cycles with serialization between every cycle.
let uid=ctx.state.petRecords.poring_egg[0].petUid;
for(let i=0;i<1000;i++){
  ctx.state=JSON.parse(JSON.stringify(ctx.state));
  if(ctx.getItemQty('pet_incubator')===0)ctx.addItem('pet_incubator',1);
  if(ctx.getItemQty('poring_egg')===0)ctx.addItem('poring_egg',1);
  if(!ctx.hatchPetByUid('poring_egg',uid))throw new Error('restore failed at '+i);
  ctx.state.pet.intimacy=(i*37)%1001;ctx.state.pet.hunger=(i*13)%101;ctx.state.pet.autoFeed=(i%2===0);
  ctx.returnPetToEgg();
  if(ctx.state.petRecords.poring_egg.length!==1)throw new Error('archive row count at '+i);
}
check('1000 serialized restore/return cycles preserve one stable pet UID',()=>ctx.state.petRecords.poring_egg.length===1&&ctx.state.petRecords.poring_egg[0].petUid===uid&&ctx.state.pet===null);
// 133 species × 3 intimacy tiers: bonuses must remain finite and species data valid.
const eggs=ctx.petEggIds();
let speciesChecks=0;
for(const eggId of eggs){
 for(const intimacy of [250,750,950]){
  ctx.state.pet={eggId,petUid:'matrix-'+eggId,intimacy,hunger:80};
  const map=ctx.activePetBonusMap();
  for(const [key,value] of Object.entries(map)) if(typeof value==='number'&&!Number.isFinite(value)) throw new Error('nonfinite bonus '+eggId+' '+key);
  speciesChecks++;
 }
}
check('All pet species remain stable across 399 species/tier combinations',()=>speciesChecks===399&&eggs.length===133);
// A separate 30-day run with auto-feed and a finite food stock checks that the loop remains bounded.
ctx.state.pet=null;
ctx.state.inventory=[{item:'poring_egg',qty:1},{item:'pet_incubator',qty:1},{item:'apple_juice',qty:2000}];
ctx.hatchPet('poring_egg',false);
ctx.state.pet.intimacy=950;ctx.state.pet.hunger=100;ctx.state.pet.autoFeed=true;ctx.state.pet.lastCareAt=now;
for(let day=0;day<30;day++){
  for(let block=0;block<3;block++){
    now+=8*60*60000;
    if(ctx.state.pet)ctx.tickPetCare();
  }
}
check('30-day auto-feed run keeps the pet active with finite bounded stats',()=>!!ctx.state.pet&&ctx.state.pet.hunger>=0&&ctx.state.pet.hunger<=100&&ctx.state.pet.intimacy>=0&&ctx.state.pet.intimacy<=1000&&ctx.state.pet.petUid);
check('30-day auto-feed run consumes food stock without inventory underflow',()=>ctx.getItemQty('apple_juice')>=0&&ctx.getItemQty('apple_juice')<2000);
console.log(`30-day / 1000-cycle pet runtime stress checks passed (${checks.length}); species matrix ${speciesChecks}; saves ${saves}; throttled saves ${throttled}; logs ${logs.length}`);
console.log(checks.map(x=>'- '+x).join('\n'));
