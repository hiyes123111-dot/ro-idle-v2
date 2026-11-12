const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c={console,Math,Set,Map,Float64Array};vm.createContext(c);
vm.runInContext(fs.readFileSync('js/data.js','utf8')+';globalThis.x={ITEMS};',c,{timeout:30000});
const I=c.x.ITEMS;
const pairs=[
['gaebolg_armor','yorscalp_armor','armor'],['gaebolg_robe','yorscalp_robe','armor'],
['gaebolg_manteau','yorscalp_manteau','garment'],['gaebolg_muffler','yorscalp_muffler','garment'],
['gaebolg_boots','yorscalp_boots','footgear'],['gaebolg_shoes','yorscalp_shoes','footgear'],
['gaebolg_earring','yorscalp_earring','accessory'],['gaebolg_glove','yorscalp_glove','accessory'],
['gaebolg_ring','yorscalp_ring','accessory'],['gaebolg_necklace','yorscalp_necklace','accessory']];
for(const [b,r,slot] of pairs){assert(I[b],b);assert(I[r],r);assert.equal(I[b].armorType,slot,b+' slot');}
const eng=fs.readFileSync('js/engine.js','utf8');
assert(eng.includes('function reforgeYorscalpEquipment(baseId)'),'reforge action exists');
assert(eng.includes("k.startsWith('gaebolg_')"),'Gaebolg base equipment excluded from random box pools');
for(const id of ['ep21_wigner_ticket','yorscalp_spirit','yorscalp_symbol','yorscalp_serpent']) assert(eng.includes(id),'material required '+id);
assert(eng.includes('instances[instId].item = recipe.result'),'instance conversion preserves item instance metadata');
assert(eng.includes('rollGaebolgGearLoot(1)')&&eng.includes('rollGaebolgGearLoot(partialKill)'),'offline boss gear rewards');
const ui=fs.readFileSync('js/ui.js','utf8');
assert(ui.includes('function openYorscalpBlacksmith()'),'blacksmith interface');
assert(ui.includes('鐵匠珊珊'),'town NPC');

// Exercise one conversion with a refined, carded item instance and assert all metadata survives.
const runtime={ITEMS:I, state:{inventory:[{item:'gaebolg_armor',qty:1,instanceId:'test-inst'}],instances:{'test-inst':{item:'gaebolg_armor',refine:12,cards:['sample_card'],grade:'A',enchant:['x'],extraSlots:1}}},
  console,Math,allyOwnerState(){return runtime.state;},getItemQty(id){const r=runtime.state.inventory.find(x=>x.item===id&&!x.instanceId);return r?r.qty:0;},
  removeItem(id,n){const r=runtime.state.inventory.find(x=>x.item===id&&!x.instanceId);if(!r||r.qty<n)return false;r.qty-=n;if(!r.qty)runtime.state.inventory=runtime.state.inventory.filter(x=>x!==r);return true;},
  addItem(id,n){const r=runtime.state.inventory.find(x=>x.item===id&&!x.instanceId);if(r)r.qty+=n;else runtime.state.inventory.push({item:id,qty:n});},
  withOwner(fn){fn();},codexRecordItem(){},logMsg(){},saveGame(){}};
for(const [id,n] of Object.entries({ep21_wigner_ticket:200,yorscalp_spirit:200,yorscalp_symbol:50,yorscalp_serpent:10}))runtime.state.inventory.push({item:id,qty:n});
const start=eng.indexOf('const YORSCALP_REFORGE_RECIPES =');
const end=eng.indexOf('/* 一次開完手上所有同款箱子',start);
assert(start>=0&&end>start,'reforge function block boundaries');
vm.createContext(runtime);
vm.runInContext(eng.slice(start,end),runtime);
const result=vm.runInContext("reforgeYorscalpEquipment('gaebolg_armor')",runtime);
assert.equal(result.ok,true,'reforge runtime success');
const inst=runtime.state.instances['test-inst'];
assert.equal(inst.item,'yorscalp_armor');
assert.equal(inst.refine,12);assert.deepEqual(Array.from(inst.cards),['sample_card']);
assert.equal(inst.grade,'A');assert.deepEqual(Array.from(inst.enchant),['x']);assert.equal(inst.extraSlots,1);
for(const [id,n] of Object.entries({ep21_wigner_ticket:200,yorscalp_spirit:200,yorscalp_symbol:50,yorscalp_serpent:10}))assert.equal(runtime.getItemQty(id),0,id+' consumed');
console.log('v2.5.320 Yorscalp reforge: PASS (10 conversion pairs, NPC, material checks, instance metadata retention, offline loot)');

