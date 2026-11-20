const fs = require('fs');
const vm = require('vm');
const checks=[];
function check(name, fn) { if (!fn()) throw new Error('FAIL: '+name); checks.push(name); }
const ITEMS={
  poring_egg:{name:'波利寵物蛋',desc:'寵物蛋。種類: 寵物蛋'},
  pet_incubator:{name:'攜帶用孵蛋器',desc:'孵化寵物蛋'},
  pet_food:{name:'寵物飼料',desc:'寵物飼料'}
};
const qty={poring_egg:4,pet_incubator:4,pet_food:10};
const ctx={
  console,ITEMS,Date,
  state:{pet:null,petRecords:{},gold:100000,inventory:[]},
  window:{prompt:()=> '新寵'},
  getItemQty:id=>qty[id]||0,
  removeItem:(id,n)=>{qty[id]=Math.max(0,(qty[id]||0)-n);},
  addItem:(id,n)=>{qty[id]=(qty[id]||0)+n;},
  recomputeDerived:()=>{},logMsg:()=>{},saveGame:()=>true,
  renderInventoryTab:()=>{},renderPetCenter:()=>{},activeTab:'pet',invCategory:'pet'
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../js/v2_5_456_pet_system.js','utf8'),ctx);
check('First new pet hatches with unique UID',()=>ctx.hatchPet('poring_egg',false) && !!ctx.state.pet.petUid);
const uid1=ctx.state.pet.petUid;
ctx.state.pet.name='小波 A';ctx.state.pet.named=true;ctx.state.pet.intimacy=812;ctx.state.pet.hunger=33;ctx.state.pet.autoFeed=true;
check('First pet profile is stored independently on return',()=>ctx.returnPetToEgg() && ctx.state.petRecords.poring_egg.length===1 && ctx.state.petRecords.poring_egg[0].petUid===uid1);
check('Second new pet can hatch without consuming first profile',()=>ctx.hatchPet('poring_egg',false) && ctx.state.pet.petUid!==uid1 && ctx.state.petRecords.poring_egg.length===2);
const uid2=ctx.state.pet.petUid;
ctx.state.pet.name='小波 B';ctx.state.pet.named=true;ctx.state.pet.intimacy=401;ctx.state.pet.hunger=77;
check('Second pet return updates only its own profile',()=>ctx.returnPetToEgg() && ctx.state.petRecords.poring_egg.length===2 && ctx.state.petRecords.poring_egg.find(r=>r.petUid===uid2).intimacy===401 && ctx.state.petRecords.poring_egg.find(r=>r.petUid===uid1).intimacy===812);
check('Restore mode recovers first individual in order',()=>ctx.hatchPet('poring_egg',true) && ctx.state.pet.petUid===uid1 && ctx.state.pet.name==='小波 A' && ctx.state.pet.intimacy===812 && ctx.state.pet.hunger===33 && ctx.state.pet.autoFeed);
ctx.state.pet.intimacy=900;
check('Active profile sync does not overwrite another individual',()=>ctx.syncPetRecord(ctx.state.pet) && ctx.state.petRecords.poring_egg.length===2 && ctx.state.petRecords.poring_egg.find(r=>r.petUid===uid2).intimacy===401);
const roundTrip=JSON.parse(JSON.stringify(ctx.state.petRecords));
check('Multiple individual profiles survive JSON save/load',()=>roundTrip.poring_egg.length===2 && new Set(roundTrip.poring_egg.map(r=>r.petUid)).size===2);
ctx.state.petRecords={poring_egg:{eggId:'poring_egg',name:'舊版小波',intimacy:765,hunger:22,named:true}};
check('Legacy single-object record migrates to array',()=>ctx.ensurePetRecords().poring_egg.length===1 && ctx.state.petRecords.poring_egg[0].name==='舊版小波' && !!ctx.state.petRecords.poring_egg[0].petUid);
const engine=fs.readFileSync(__dirname+'/../js/engine.js','utf8');
check('Engine migrates legacy and array formats',()=>engine.includes('const rows = Array.isArray(raw) ? raw : (raw && typeof raw === \'object\' ? [raw] : []);'));
check('Engine assigns unique UID to loaded active pet',()=>engine.includes('state.pet.petUid = String(state.pet.petUid);'));
check('Engine reuses migrated active profile UID to avoid duplicate pet records',()=>engine.includes('const matching = rows.find(r => r && r.name === state.pet.name'));
const center=fs.readFileSync(__dirname+'/../js/v2_5_462_pet_center.js','utf8');
check('Pet codex offers restore and new hatch choices',()=>center.includes('恢復培養') && center.includes('孵化新寵物'));
const index=fs.readFileSync(__dirname+'/../index.html','utf8');
const sw=fs.readFileSync(__dirname+'/../sw.js','utf8');
check('All HTML cache query versions are 2.5.491',()=>!/[?&]v=2\.5\.(?!491)\d+/.test(index));
check('Service worker runtime cache is 2.5.491',()=>sw.includes('ro-idle-runtime-v2.5.491'));
console.log(`v2.5.491 multi-instance checks passed (${checks.length}):\n- `+checks.join('\n- '));
