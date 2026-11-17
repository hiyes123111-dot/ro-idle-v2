const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const checks=[];
const assert=(name,fn)=>{if(!fn())throw new Error('FAIL '+name);checks.push(name);};

// Minimal item/account harness for inventory transaction failures.
const ITEMS={
  poring_egg:{name:'波利寵物蛋',desc:'寵物蛋'},
  pet_incubator:{name:'攜帶用孵蛋器',desc:'孵蛋器'},
  pet_food:{name:'寵物飼料',desc:'寵物飼料'}
};
let qty={poring_egg:1,pet_incubator:1,pet_food:1};
let failRemoveId=null;
const ctx={
 console,Date,Math,ITEMS,
 state:{pet:null,petRecords:{},inventory:[],gold:0},
 window:{prompt:()=> '波利'}, document:{getElementById:()=>null},
 getItemQty:id=>qty[id]||0,
 removeItem(id,n){
   if(id===failRemoveId)return false;
   if((qty[id]||0)<n)return false;
   qty[id]-=n;return true;
 },
 addItem(id,n){qty[id]=(qty[id]||0)+n;},
 recomputeDerived(){},logMsg(){},saveGame(){return true;},saveGameThrottled(){return true;},
 renderInventoryTab(){},renderPetCenter(){},renderTopBar(){},refreshPetCenterIfOpen(){},
 activeTab:'',invCategory:''
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8'),ctx);

// Hatch must be all-or-nothing if the egg removal unexpectedly fails.
failRemoveId='poring_egg';
assert('New hatch rolls back incubator when egg removal fails',()=>{
 const before={egg:qty.poring_egg,inc:qty.pet_incubator};
 const ok=ctx.hatchPet('poring_egg',false);
 return ok===false&&qty.poring_egg===before.egg&&qty.pet_incubator===before.inc&&!ctx.state.pet;
});
failRemoveId=null;

// A saved individual must remain in the archive if the hatch transaction fails.
ctx.state.petRecords.poring_egg=[{eggId:'poring_egg',petUid:'uid-restore',name:'舊波利',intimacy:700,hunger:40}];
failRemoveId='poring_egg';
assert('UID restore preserves archived individual on item-removal failure',()=>{
 const before={egg:qty.poring_egg,inc:qty.pet_incubator};
 const ok=ctx.hatchPetByUid('poring_egg','uid-restore');
 return ok===false&&qty.poring_egg===before.egg&&qty.pet_incubator===before.inc&&!ctx.state.pet&&ctx.state.petRecords.poring_egg.length===1;
});
failRemoveId=null;

// Feeding must not update stats when the inventory operation rejects the item.
ctx.state.pet={eggId:'poring_egg',petUid:'feed-uid',name:'波利',intimacy:250,hunger:20};
failRemoveId='pet_food';
assert('Failed food removal leaves hunger and intimacy unchanged',()=>{
 const ok=ctx.feedPet('pet_food');
 return ok===false&&ctx.state.pet.hunger===20&&ctx.state.pet.intimacy===250;
});
failRemoveId=null;

// Repeated UID rows are collapsed on the next synchronization.
ctx.state.petRecords.poring_egg=[
 {eggId:'poring_egg',petUid:'dup-uid',name:'舊資料',intimacy:100,hunger:20},
 {eggId:'poring_egg',petUid:'dup-uid',name:'重複資料',intimacy:200,hunger:30}
];
ctx.state.pet={eggId:'poring_egg',petUid:'dup-uid',name:'目前資料',intimacy:800,hunger:75};
assert('Pet record sync removes duplicate rows sharing the same UID',()=>{
 return ctx.syncPetRecord(ctx.state.pet)&&ctx.state.petRecords.poring_egg.length===1&&ctx.state.petRecords.poring_egg[0].name==='目前資料';
});

// Full data and evolution harness: force a later material removal to fail.
const evo={
 console,Date,Math,ITEMS:{},state:{pet:null,petRecords:{},inventory:[],gold:0},
 document:{getElementById:()=>null},logMsg(){},saveGame(){return true;},recomputeDerived(){},
 getItemQty(id){return (evo.state.inventory||[]).filter(x=>x.item===id).reduce((n,x)=>n+x.qty,0);},
 removeItem(id,n){
   if(id==='unripe_apple')return false;
   const row=evo.state.inventory.find(x=>x.item===id);
   if(!row||row.qty<n)return false;
   row.qty-=n;if(!row.qty)evo.state.inventory=evo.state.inventory.filter(x=>x!==row);
   return true;
 },
 addItem(id,n){let row=evo.state.inventory.find(x=>x.item===id);if(row)row.qty+=n;else evo.state.inventory.push({item:id,qty:n});},
 petRecordsForEgg(id){return evo.state.petRecords[id]||(evo.state.petRecords[id]=[]);},
 ensurePetRecords(){return evo.state.petRecords;},
 syncPetRecord(p){const a=this.petRecordsForEgg(p.eggId);const i=a.findIndex(x=>x.petUid===p.petUid);if(i>=0)a[i]=JSON.parse(JSON.stringify(p));else a.push(JSON.parse(JSON.stringify(p)));return true;},
 petSafeName:s=>String(s),refreshPetCenterIfOpen(){},renderInventoryTab(){},renderPetCenter(){},renderTopBar(){}
};
vm.createContext(evo);
vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';globalThis.ITEMS=ITEMS;',evo);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8'),evo);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_457_pet_effect_completion.js'),'utf8'),evo);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_462_pet_center.js'),'utf8'),evo);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_466_pet_evolution_accessories.js'),'utf8'),evo);
evo.state.pet={eggId:'poring_egg',petUid:'evo-uid',name:'進化測試波利',intimacy:950,hunger:70,named:true};
evo.state.inventory=[{item:'leaf_of_yggdrasil',qty:10},{item:'unripe_apple',qty:3}];
assert('Evolution rolls back earlier materials if a later removal fails',()=>{
 const ok=evo.evolvePet466('poring_to_mastering');
 return ok===false&&evo.getItemQty('leaf_of_yggdrasil')===10&&evo.getItemQty('unripe_apple')===3&&evo.state.pet.eggId==='poring_egg'&&evo.state.pet.petUid==='evo-uid';
});

// Offline care must recover from a future timestamp caused by device clock rollback.
let now=Date.now(), offlineSaves=0;
class FakeDate extends Date { static now(){return now;} }
const off={
 console,Date:FakeDate,Math,ITEMS,
 state:{pet:{eggId:'poring_egg',petUid:'future-clock',name:'波利',intimacy:500,hunger:80,lastCareAt:now+86400000,autoFeed:false},petRecords:{},inventory:[],gold:0,hp:100,maxHp:100,sp:100,maxSp:100},
 getItemQty(){return 0;},removeItem(){return false;},addItem(){},buyPetMerchantItem(){return false;},
 logMsg(){},saveGame(){return true;},saveGameThrottled(){offlineSaves++;return true;},
 recomputeDerived(){},refreshPetCenterIfOpen(){},renderInventoryTab(){},activeTab:'',invCategory:'',
 effectiveGearBonuses:()=>({})
};
vm.createContext(off);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8'),off);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_457_pet_effect_completion.js'),'utf8'),off);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_458_pet_trigger_skills.js'),'utf8'),off);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_459_pet_proc_completion.js'),'utf8'),off);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_468_pet_proc_accuracy.js'),'utf8'),off);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_472_pet_combat_proc_completion.js'),'utf8'),off);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_473_pet_offline_care.js'),'utf8'),off);
assert('Future offline-care timestamp is clamped to current device time',()=>{
 const before=off.state.pet.hunger;off.tickPetCare();
 return off.state.pet.lastCareAt===now&&off.state.pet.hunger===before&&offlineSaves===1;
});
now+=60000;
assert('Offline care resumes normally after future timestamp repair',()=>{
 off.tickPetCare();return off.state.pet.hunger===79&&off.state.pet.lastCareAt===now;
});


// The pet stays attached to the same UID through player death and resumes care after revival.
let lifeNow=Date.now(), lifeTicks=0;
class LifeDate extends Date { static now(){return lifeNow;} }
const life={
 console,Date:LifeDate,Math,ITEMS,
 state:{pet:{eggId:'poring_egg',petUid:'life-uid',name:'波利',intimacy:500,hunger:100,lastCareAt:lifeNow,autoFeed:false},petRecords:{},inventory:[],gold:0,hp:0,maxHp:100,sp:100,maxSp:100},
 getItemQty(){return 0;},removeItem(){return false;},addItem(){},buyPetMerchantItem(){return false;},
 logMsg(){},saveGame(){return true;},saveGameThrottled(){return true;},recomputeDerived(){},refreshPetCenterIfOpen(){},renderInventoryTab(){},
 activeTab:'',invCategory:'',effectiveGearBonuses:()=>({}),gameTick(){lifeTicks++;}
};
vm.createContext(life);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8'),life);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_457_pet_effect_completion.js'),'utf8'),life);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_458_pet_trigger_skills.js'),'utf8'),life);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_459_pet_proc_completion.js'),'utf8'),life);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_468_pet_proc_accuracy.js'),'utf8'),life);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_472_pet_combat_proc_completion.js'),'utf8'),life);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_473_pet_offline_care.js'),'utf8'),life);
assert('Pet remains active and care tick pauses while player is dead',()=>{
 const stamp=life.state.pet.lastCareAt;life.gameTick();
 return lifeTicks===1&&life.state.pet.petUid==='life-uid'&&life.state.pet.lastCareAt===stamp;
});
lifeNow+=60000;life.state.hp=100;
assert('Pet resumes care after player revival without changing its UID',()=>{
 life.gameTick();
 return lifeTicks===2&&life.state.pet.petUid==='life-uid'&&life.state.pet.hunger===99&&life.state.pet.lastCareAt===lifeNow;
});

// Narrow-screen styles stack pet codex actions below the content and make controls tappable.
const petCss=fs.readFileSync(path.join(root,'css/style.css'),'utf8');
assert('Pet codex uses stacked full-width controls on narrow screens',()=>{
 return petCss.includes('@media (max-width: 640px)')&&petCss.includes('.pet-codex-row { grid-template-columns: minmax(0, 1fr) !important; }')&&petCss.includes('.pet-instance-row button { width: 100%; min-height: 40px; }');
});

// Release metadata consistency is checked as part of the same suite.
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const version=fs.readFileSync(path.join(root,'VERSION.txt'),'utf8').trim();
assert('v2.5.479 release version and runtime cache are synchronized',()=>{
 const q=[...html.matchAll(/[?&]v=([^"'&]+)/g)].map(x=>x[1]);
 return version==='v2.5.479'&&q.length>0&&q.every(x=>x==='2.5.479')&&sw.includes('ro-idle-runtime-v2.5.479');
});

console.log(`v2.5.479 remaining pet-system safety checks passed (${checks.length}):\n- `+checks.join('\n- '));
