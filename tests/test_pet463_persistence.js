const fs = require('fs');
const vm = require('vm');
const checks = [];
function check(name, fn) { if (!fn()) throw new Error('FAIL: '+name); checks.push(name); }
const items = {
  poring_egg:{name:'波利寵物蛋',desc:'寵物蛋。種類: 寵物蛋'},
  pet_incubator:{name:'攜帶用孵蛋器',desc:'孵化寵物蛋'},
  pet_food:{name:'寵物飼料',desc:'寵物飼料'}
};
const qty = {poring_egg:1,pet_incubator:2,pet_food:2};
const logs=[];
let centerRefreshes=0;
const ctx = {
  console, ITEMS:items,
  state:{pet:null,petRecords:{},gold:100000,inventory:[]},
  Date,
  window:{prompt:()=> '小波'},
  getItemQty:id=>qty[id]||0,
  removeItem:(id,n)=>{qty[id]=Math.max(0,(qty[id]||0)-n);},
  addItem:(id,n)=>{qty[id]=(qty[id]||0)+n;},
  recomputeDerived:()=>{}, logMsg:m=>logs.push(m), saveGame:()=>true,
  renderInventoryTab:()=>{}, renderPetCenter:()=>{centerRefreshes++;}, activeTab:'pet', invCategory:'pet'
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../js/v2_5_456_pet_system.js','utf8'),ctx);
check('First hatch creates default pet profile',()=>ctx.hatchPet('poring_egg') && ctx.state.pet.intimacy===250 && ctx.state.pet.hunger===100);
check('Pet center refreshes after hatch',()=>centerRefreshes>0);
ctx.state.pet.hunger=20;
check('Feeding updates the archived profile',()=>ctx.feedPet('pet_food') && ctx.state.petRecords.poring_egg[0].hunger===55 && ctx.state.petRecords.poring_egg[0].intimacy===280);
ctx.state.pet.intimacy=876;
ctx.state.pet.hunger=42;
ctx.state.pet.name='小波';
ctx.state.pet.named=true;
ctx.state.pet.autoFeed=true;
ctx.state.pet.autoBuyReserve=25000;
check('Return archives name, intimacy, hunger and feeding settings',()=>{
  const ok=ctx.returnPetToEgg(); const r=ctx.state.petRecords.poring_egg[0];
  return ok && !ctx.state.pet && qty.poring_egg===1 && r.name==='小波' && r.intimacy===876 && r.hunger===42 && r.named && r.autoFeed && r.autoBuyReserve===25000 && centerRefreshes>=2;
});
const stored=JSON.parse(JSON.stringify(ctx.state.petRecords));
ctx.state.petRecords=JSON.parse(JSON.stringify(stored));
check('Pet profile survives save/load JSON round trip',()=>ctx.state.petRecords.poring_egg[0].intimacy===876 && ctx.state.petRecords.poring_egg[0].name==='小波');
check('Re-hatching restores archived training instead of resetting',()=>{
  const ok=ctx.hatchPet('poring_egg'); const p=ctx.state.pet;
  return ok && p.name==='小波' && p.intimacy===876 && p.hunger===42 && p.named && p.autoFeed && p.autoBuyReserve===25000;
});
check('Restored pet pauses care timer while stored',()=>ctx.state.pet.lastCareAt>0 && Math.abs(Date.now()-ctx.state.pet.lastCareAt)<5000);
check('Return/re-hatch does not duplicate pet egg or incubator',()=>qty.poring_egg===0 && qty.pet_incubator===0);
check('Hunger zero is preserved in archived profile',()=>{
  ctx.state.pet.hunger=0; ctx.state.pet.intimacy=0;
  ctx.syncPetRecord(ctx.state.pet);
  return ctx.state.petRecords.poring_egg[0].hunger===0 && ctx.state.petRecords.poring_egg[0].intimacy===0;
});
check('Archived profile is keyed by actual pet egg ID',()=>Object.keys(ctx.state.petRecords).length===1 && Array.isArray(ctx.state.petRecords.poring_egg) && ctx.state.petRecords.poring_egg.length===1);
const engine=fs.readFileSync(__dirname+'/../js/engine.js','utf8');
check('New character state initializes petRecords',()=>engine.includes('petRecords: {},        // v2.5.464'));
check('Load migration preserves legacy active pet into archive',()=>engine.includes('const rows = state.petRecords[state.pet.eggId] || (state.petRecords[state.pet.eggId] = []);'));
const index=fs.readFileSync(__dirname+'/../index.html','utf8');
const sw=fs.readFileSync(__dirname+'/../sw.js','utf8');
check('HTML runtime references all use v2.5.481',()=>!/[?&]v=2\.5\.(?!481)\d+/.test(index));
check('Service worker cache uses v2.5.481',()=>sw.includes('ro-idle-runtime-v2.5.481'));
console.log(`v2.5.463 compatibility persistence checks passed (${checks.length}):\n- `+checks.join('\n- '));
