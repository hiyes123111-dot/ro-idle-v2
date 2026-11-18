const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
let now=Date.now();
class FakeDate extends Date { static now(){ return now; } }
const checks=[];
const assert=(name,fn)=>{if(!fn())throw new Error('FAIL '+name);checks.push(name);};
const ctx={
 console,Date:FakeDate,Math,state:null,ITEMS:{},
 getItemQty(id){return (ctx.state.inventory||[]).filter(x=>x.item===id).reduce((n,x)=>n+x.qty,0);},
 removeItem(id,qty){const row=(ctx.state.inventory||[]).find(x=>x.item===id&&x.qty>=qty);if(!row)return false;row.qty-=qty;if(!row.qty)ctx.state.inventory=ctx.state.inventory.filter(x=>x!==row);return true;},
 addItem(id,qty){let row=ctx.state.inventory.find(x=>x.item===id);if(row)row.qty+=qty;else ctx.state.inventory.push({item:id,qty});},
 buyPetMerchantItem(){return false;},logMsg(msg){ctx.logs.push(msg);},logs:[],
 saveGame(){ctx.saves++;return true;},saveGameThrottled(){ctx.throttledSaves++;return true;},
 saves:0,throttledSaves:0,recomputeDerived(){},refreshPetCenterIfOpen(){},
 renderInventoryTab(){},activeTab:'',invCategory:'',effectiveGearBonuses:()=>({})
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';globalThis.ITEMS=ITEMS;',ctx);
ctx.state={pet:null,petRecords:{},inventory:[],gold:0,hp:100,maxHp:100,sp:100,maxSp:100};
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_457_pet_effect_completion.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_458_pet_trigger_skills.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_459_pet_proc_completion.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_468_pet_proc_accuracy.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_472_pet_combat_proc_completion.js'),'utf8'),ctx);

vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_473_pet_offline_care.js'),'utf8'),ctx);
assert('Loli Ruri low-intimacy codex shows a locked trigger instead of a false unresolved warning',()=>{
 const rows=ctx.petSpecialEffectSummary('loli_ruri_egg',500);
 return rows.some(x=>x.includes('尚未開放'))&&!rows.some(x=>x.includes('未有明確機率'));
});
assert('Loli Ruri cordial and loyal codex tiers show the implemented Heal trigger',()=>{
 return ctx.petSpecialEffectSummary('loli_ruri_egg',750).some(x=>x.includes('已實裝'))&&ctx.petSpecialEffectSummary('loli_ruri_egg',950).some(x=>x.includes('治癒術 Lv2'));
});

const releaseHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
const releaseSw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const releaseVersion=fs.readFileSync(path.join(root,'VERSION.txt'),'utf8').trim();
assert('v2.5.481 offline-care module is registered and release cache versions are synchronized',()=>{
 const versions=[...releaseHtml.matchAll(/[?&]v=([^"'&]+)/g)].map(m=>m[1]);
 return releaseHtml.includes('js/v2_5_473_pet_offline_care.js?v=2.5.481')&&
   versions.length>0&&versions.every(v=>v==='2.5.481')&&
   releaseSw.includes('ro-idle-runtime-v2.5.481')&&releaseVersion==='v2.5.481';
});
function setupPet(overrides={}) {
 ctx.state.pet=Object.assign({eggId:'poring_egg',petUid:'pet-offline-test',name:'波利',intimacy:250,hunger:100,lastCareAt:now-120*60000,named:false,autoFeed:true,autoBuyReserve:10000},overrides);
 ctx.state.inventory=[];ctx.state.gold=0;ctx.logs=[];ctx.saves=0;ctx.throttledSaves=0;
}
assert('Offline auto-feed triggers repeatedly at each hunger threshold',()=>{
 setupPet();ctx.state.inventory=[{item:'apple_juice',qty:3}];ctx.tickPetCare();
 return ctx.state.pet.hunger===85&&ctx.state.pet.intimacy===310&&ctx.getItemQty('apple_juice')===0;
});
assert('Offline no-food care reduces hunger first and intimacy only after hunger reaches zero',()=>{
 setupPet({autoFeed:false});ctx.tickPetCare();
 return ctx.state.pet.hunger===0&&ctx.state.pet.intimacy===230;
});
assert('Failed offline auto-feed attempts only once per catch-up window',()=>{
 setupPet();ctx.tickPetCare();
 return ctx.state.pet.hunger===0&&ctx.state.pet.intimacy===230&&ctx.logs.filter(x=>x.includes('寵物飼料不足')).length===1;
});
assert('Offline care catch-up remains capped at eight hours per tick without losing remaining time',()=>{
 setupPet({lastCareAt:now-10*60*60000,autoFeed:false,intimacy:1000});ctx.tickPetCare();
 const first=ctx.state.pet?.lastCareAt;ctx.tickPetCare();
 return first===now-2*60*60000&&ctx.state.pet?.lastCareAt===now;
});
assert('Auto-feed can rescue a pet at zero hunger before safe return',()=>{
 setupPet({hunger:0,intimacy:1,lastCareAt:now-60000});ctx.state.inventory=[{item:'apple_juice',qty:1}];ctx.tickPetCare();
 return !!ctx.state.pet&&ctx.state.pet.hunger===35&&ctx.state.pet.intimacy===31;
});
assert('Offline care persists updated pet record and throttled save',()=>{
 setupPet({autoFeed:false});ctx.tickPetCare();
 return ctx.state.petRecords.poring_egg?.some(x=>x.petUid==='pet-offline-test'&&x.hunger===0&&x.intimacy===230)&&ctx.throttledSaves===1;
});
console.log(`v2.5.481 offline pet care checks passed (${checks.length}):\n- `+checks.join('\n- '));
