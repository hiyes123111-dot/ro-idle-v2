const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const eng = fs.readFileSync('js/engine.js','utf8');
const ui = fs.readFileSync('js/ui.js','utf8');

function extractFunction(src, signature) {
  const start = src.indexOf(signature);
  assert(start >= 0, `missing ${signature}`);
  const brace = src.indexOf('{', start);
  let depth = 0, inS=false, inD=false, inT=false, esc=false;
  for (let i=brace;i<src.length;i++) {
    const c=src[i], p=src[i-1];
    if (esc) { esc=false; continue; }
    if ((inS||inD||inT) && c==='\\') { esc=true; continue; }
    if (!inD&&!inT&&c==="'"&&!inS) { inS=true; continue; }
    if (inS&&c==="'") { inS=false; continue; }
    if (!inS&&!inT&&c==='"'&&!inD) { inD=true; continue; }
    if (inD&&c==='"') { inD=false; continue; }
    if (!inS&&!inD&&c==='`'&&!inT) { inT=true; continue; }
    if (inT&&c==='`') { inT=false; continue; }
    if (inS||inD||inT) continue;
    if (c==='{') depth++;
    if (c==='}' && --depth===0) return src.slice(start,i+1);
  }
  throw new Error(`unterminated ${signature}`);
}
const saveFn=extractFunction(eng,'function saveGame()');
function makeState() {
  return {name:'TestHero',jobId:'novice',createdAt:123,mapId:'field_test',
    lastActiveAt:100,inventory:[],stats:{str:1},equip:{},allies:[{_allyName:'Ally',monsters:[{id:1}],monster:{id:1}}]};
}
function harness(opts={}) {
  const store=new Map([['ro_idle_save_slot_0','OLD_VALID_SAVE']]);
  const calls=[];
  const localStorage={
    setItem(k,v){calls.push(['set',k]);if(opts.throwSet)throw Object.assign(new Error('quota'),{name:'QuotaExceededError'});store.set(k,String(v));},
    getItem(k){if(opts.mismatch&&k==='ro_idle_save_slot_0')return 'DIFFERENT';return store.has(k)?store.get(k):null;}
  };
  const sandbox={state:makeState(),_allyActing:false,currentSlot:0,MAX_SLOTS:15,
    getSlotKey:n=>'ro_idle_save_slot_'+n,localStorage,Date,
    console:{error(){}},showToast:m=>calls.push(['toast',m]),
    lastSaveTs:0,saveFailureNotified:false,pendingSaveTimer:null,savePending:false,clearTimeout(){}};
  vm.createContext(sandbox);vm.runInContext(saveFn,sandbox);
  return {sandbox,store,calls};
}
{
 const h=harness(); assert.strictEqual(h.sandbox.saveGame(),true);
 const saved=JSON.parse(h.store.get('ro_idle_save_slot_0'));
 assert.strictEqual(saved.name,'TestHero'); assert.strictEqual(saved.allies[0].monsters,null);
 assert.strictEqual(h.sandbox.state.allies[0].monsters[0].id,1,'live ally state must not be mutated');
}
{
 const h=harness({throwSet:true}); assert.strictEqual(h.sandbox.saveGame(),false);
 assert.strictEqual(h.store.get('ro_idle_save_slot_0'),'OLD_VALID_SAVE','failed write must not replace prior save');
 assert(h.calls.some(c=>c[0]==='toast'));
}
{
 const h=harness({mismatch:true}); assert.strictEqual(h.sandbox.saveGame(),false);
 assert.strictEqual(h.store.get('ro_idle_save_slot_0')!=='OLD_VALID_SAVE',true);
}
{
 const h=harness(); h.sandbox._allyActing={_allyName:'ally'};
 assert.strictEqual(h.sandbox.saveGame(),true); assert.strictEqual(h.calls.length,0);
}
{
 const h=harness(); h.sandbox.currentSlot=99;
 assert.strictEqual(h.sandbox.saveGame(),false);
 assert.strictEqual(h.store.get('ro_idle_save_slot_0'),'OLD_VALID_SAVE');
}
const confirmFn=extractFunction(ui,'function confirmCreate()');
{
 const calls=[];
 const sandbox={document:{getElementById:()=>({value:'NewHero'})},creationAlloc:{},selectedGender:'male',
   createCharacter:()=>false,showToast:m=>calls.push('toast'),enterGame:()=>calls.push('enter')};
 vm.createContext(sandbox);vm.runInContext(confirmFn,sandbox);sandbox.confirmCreate();
 assert.deepStrictEqual(calls,['toast'],'must not enter game if first save fails');
}
{
 const calls=[];
 const sandbox={document:{getElementById:()=>({value:'NewHero'})},creationAlloc:{},selectedGender:'male',
   createCharacter:()=>true,showToast:()=>{},enterGame:()=>calls.push('enter')};
 vm.createContext(sandbox);vm.runInContext(confirmFn,sandbox);sandbox.confirmCreate();
 assert.deepStrictEqual(calls,['enter']);
}
console.log('PASS verified save write + read-back');
console.log('PASS quota failure preserves previous slot and warns');
console.log('PASS read-back mismatch rejected');
console.log('PASS withAlly save remains intentionally skipped');
console.log('PASS invalid slot rejected');
console.log('PASS new character cannot enter game unless first save succeeds');
console.log('6/6 passed');
