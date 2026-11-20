const fs = require('fs');
const vm = require('vm');
const checks = [];
function check(name, fn) { if (!fn()) throw new Error('FAIL: ' + name); checks.push(name); }
const ITEMS = {
  poring_egg: { name:'波利寵物蛋', desc:'沉睡著寵物波利的蛋。種類: 寵物蛋' },
  moonlight_egg: { name:'月夜貓寵物蛋', desc:'沉睡著寵物月夜貓的蛋。種類: 寵物蛋' },
  pet_incubator: { name:'攜帶用孵蛋器', desc:'孵化寵物蛋' },
  pet_food: { name:'寵物飼料', desc:'寵物飼料' }
};
const qty = { poring_egg:3, moonlight_egg:0, pet_incubator:3, pet_food:0 };
const elements = { 'tab-pet':{innerHTML:''}, 'pet-center-codex-list':{innerHTML:''} };
const ctx = {
  console, ITEMS, Date,
  state:{ pet:null, petRecords:{}, codex:{item:{poring_egg:1}}, inventory:[], gold:100000 },
  document:{getElementById:id=>elements[id]||null},
  window:{prompt:()=> '新寵'},
  getItemQty:id=>qty[id]||0,
  removeItem:(id,n)=>{qty[id]=Math.max(0,(qty[id]||0)-n);},
  addItem:(id,n)=>{qty[id]=(qty[id]||0)+n;},
  recomputeDerived:()=>{}, logMsg:()=>{}, saveGame:()=>true,
  renderInventoryTab:()=>{}, renderTopBar:()=>{}, renderPetCenter:()=>{},
  renderPetPanel:()=>'<div>pet panel</div>', petMerchantPanelHtml:()=>'<div>shop</div>',
  petSpecialEffectSummary:()=>[], activeTab:'pet', invCategory:'pet'
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../js/v2_5_456_pet_system.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../js/v2_5_462_pet_center.js','utf8'),ctx);

const baseRows = [
  {eggId:'poring_egg',petUid:'pet-a',name:'波利甲',intimacy:812,hunger:33,named:true,autoFeed:true,autoBuyReserve:10000},
  {eggId:'poring_egg',petUid:'pet-b',name:'波利乙',intimacy:401,hunger:77,named:true,autoFeed:false,autoBuyReserve:20000}
];
ctx.state.petRecords.poring_egg = JSON.parse(JSON.stringify(baseRows));
check('Specific UID restores selected second pet',()=>ctx.hatchPetByUid('poring_egg','pet-b') && ctx.state.pet.petUid==='pet-b' && ctx.state.pet.name==='波利乙' && ctx.state.pet.intimacy===401 && ctx.state.pet.hunger===77);
check('Other individual remains unchanged after selected restore',()=>ctx.state.petRecords.poring_egg.length===2 && ctx.state.petRecords.poring_egg.find(r=>r.petUid==='pet-a').intimacy===812 && ctx.state.petRecords.poring_egg.find(r=>r.petUid==='pet-b').intimacy===401);
check('Selected profile is moved to active state without duplication',()=>ctx.state.petRecords.poring_egg.filter(r=>r.petUid==='pet-b').length===1);
check('Invalid UID does not consume egg or incubator',()=>{const e=qty.poring_egg,i=qty.pet_incubator;return ctx.hatchPetByUid('poring_egg','missing')===false && qty.poring_egg===e && qty.pet_incubator===i;});
check('Active pet blocks another restore without consuming items',()=>{const e=qty.poring_egg,i=qty.pet_incubator;return ctx.hatchPetByUid('poring_egg','pet-a')===false && qty.poring_egg===e && qty.pet_incubator===i;});
check('Wrong pet egg ID is rejected',()=>ctx.hatchPetByUid('unknown_egg','pet-a')===false);
check('Missing incubator does not consume saved profile or egg',()=>{const e=qty.poring_egg,i=qty.pet_incubator;qty.pet_incubator=0;const ok=ctx.hatchPetByUid('poring_egg','pet-a')===false;qty.pet_incubator=i;return ok && qty.poring_egg===e && ctx.state.petRecords.poring_egg.some(r=>r.petUid==='pet-a');});
check('Missing pet egg does not consume incubator or saved profile',()=>{const e=qty.poring_egg,i=qty.pet_incubator;qty.poring_egg=0;const ok=ctx.hatchPetByUid('poring_egg','pet-a')===false;qty.poring_egg=e;return ok && qty.pet_incubator===i && ctx.state.petRecords.poring_egg.some(r=>r.petUid==='pet-a');});

ctx.state.pet=null;
ctx.state.petRecords.poring_egg=JSON.parse(JSON.stringify(baseRows));
qty.poring_egg=2; qty.pet_incubator=2;
ctx.switchPetCenterView('codex');
let html=elements['pet-center-codex-list'].innerHTML;
check('Codex lists every saved pet as a separate row',()=>html.includes('波利甲') && html.includes('波利乙'));
check('Codex shows individual intimacy and hunger values',()=>html.includes('親密度 812/1000') && html.includes('飢餓度 77/100'));
check('Codex exposes exact UID restore handlers',()=>html.includes("hatchPetByUid('poring_egg','pet-a')") && html.includes("hatchPetByUid('poring_egg','pet-b')"));
check('Codex reserves eggs for saved pets and hides new-pet action when none are free',()=>!html.includes('孵化新寵物（新個體）') && html.includes('現有寵物蛋已保留'));
qty.poring_egg=3;
ctx.renderPetCenterList(); html=elements['pet-center-codex-list'].innerHTML;
check('Codex allows a new pet only when there is an unreserved egg',()=>html.includes('孵化新寵物（新個體）'));

ctx.state.pet={eggId:'poring_egg',petUid:'pet-a',name:'波利甲',intimacy:812,hunger:33};
ctx.state.petRecords.poring_egg=JSON.parse(JSON.stringify(baseRows));
ctx.renderPetCenterList(); html=elements['pet-center-codex-list'].innerHTML;
check('Active pet is not offered as a saved-pet restore choice',()=>!html.includes("hatchPetByUid('poring_egg','pet-a')") && html.includes('目前出戰'));
check('Other saved pet remains selectable while one pet is active',()=>html.includes('波利乙') && html.includes("hatchPetByUid('poring_egg','pet-b')"));

const index=fs.readFileSync(__dirname+'/../index.html','utf8');
const sw=fs.readFileSync(__dirname+'/../sw.js','utf8');
check('All HTML asset query versions are 2.5.491',()=>!/[?&]v=2\.5\.(?!491)\d+/.test(index));
check('Service worker runtime cache is 2.5.491',()=>sw.includes('ro-idle-runtime-v2.5.491'));
console.log(`v2.5.491 pet individual-selection checks passed (${checks.length}):\n- `+checks.join('\n- '));
