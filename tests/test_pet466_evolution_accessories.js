const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname,'..');
const checks=[];
const assert=(label,fn)=>{if(!fn()) throw new Error('FAIL '+label); checks.push(label);};
const ctx={
  console, Date, Math, ITEMS:{}, state:null, document:{getElementById:()=>ctx.petHost}, petHost:{innerHTML:''},
  logMsg:()=>{}, saveGame:()=>{}, recomputeDerived:()=>{},
  getItemQty:(id)=>((ctx.state.inventory||[]).find(x=>x.item===id)||{}).qty||0,
  removeItem:(id,n)=>{const r=(ctx.state.inventory||[]).find(x=>x.item===id);if(!r||r.qty<n)return false;r.qty-=n;if(!r.qty)ctx.state.inventory=ctx.state.inventory.filter(x=>x!==r);return true;},
  addItem:(id,n)=>{let r=ctx.state.inventory.find(x=>x.item===id);if(r)r.qty+=n;else ctx.state.inventory.push({item:id,qty:n});},
  isPetEgg:(id)=>!!ctx.ITEMS[id] && (id.endsWith('_egg')||id==='scatletoncarrier'),
  petRecordsForEgg:(id)=>ctx.state.petRecords[id]||(ctx.state.petRecords[id]=[]),
  ensurePetRecords:()=>ctx.state.petRecords,
  syncPetRecord:(p)=>{const a=ctx.state.petRecords[p.eggId]||(ctx.state.petRecords[p.eggId]=[]);const i=a.findIndex(x=>x.petUid===p.petUid);if(i>=0)a[i]=JSON.parse(JSON.stringify(p));else a.push(JSON.parse(JSON.stringify(p)));return true;},
  petSafeName:s=>String(s).replace(/[&<>"]/g,''),
  refreshPetCenterIfOpen:()=>{},
  renderInventoryTab:()=>{},renderPetCenter:()=>{},renderTopBar:()=>{},
  window:{}
};
vm.createContext(ctx);
let data=fs.readFileSync(path.join(root,'js/data.js'),'utf8')+'\nglobalThis.ITEMS=ITEMS;';
vm.runInContext(data,ctx,{timeout:10000});
ctx.state={pet:null,inventory:[],petRecords:{},gold:0};
ctx.petIntimacyLabel=undefined;
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_457_pet_effect_completion.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_462_pet_center.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_466_pet_evolution_accessories.js'),'utf8')+'\nglobalThis.__recipes=PET_EVOLUTION_RECIPES_466;',ctx);
const actualPetCenterRender=ctx.renderPetCenter; ctx.renderPetCenter=()=>{};
const recipeIds=ctx.__recipes.map(r=>r.id);
assert('All six recipes resolve to existing pet eggs and material IDs',()=>ctx.__recipes.length===6&&ctx.__recipes.every(ctx.pet466RecipeIsAvailable));
assert('Pet accessory data is dynamically discovered from official item descriptions',()=>ctx.pet466AccessoryRows().length>=25);
assert('All 42 pet accessories have a valid target species and unique item ID',()=>{
 const rows=ctx.pet466AccessoryRows();
 const species=new Set(ctx.petEggIds().map(id=>ctx.pet466NameForEgg(id)));
 return rows.length===42&&new Set(rows.map(x=>x.id)).size===42&&rows.every(row=>row.allowed.length&&row.allowed.every(name=>species.has(name)));
});
assert('Accessory codex states that current item records contain no combat stats',()=>{
 const html=ctx.renderPetAccessoryCodexInfo466('deviruchi_egg');
 return html.includes('寵物奶嘴')&&html.includes('沒有可核實的角色戰鬥數值');
});

assert('Backpack pet accessories match the correct pet species',()=>{
  const poring=ctx.pet466CompatibleAccessories({eggId:'poring_egg'});
  const skelion=ctx.pet466CompatibleAccessories({eggId:'scatletoncarrier'});
  return poring.some(x=>x.id==='backpack')&&skelion.some(x=>x.id==='red_chorker_bell');
});
// Equip, persist, unequip.
ctx.state.pet={eggId:'poring_egg',petUid:'pet-poring-test',name:'Poring A',intimacy:950,hunger:80,named:true,autoFeed:true,autoBuyReserve:10000};
ctx.state.inventory=[{item:'backpack',qty:1}];
assert('Compatible pet accessory equips and leaves inventory',()=>ctx.equipPetAccessory466('backpack')&&ctx.state.pet.petAccessory==='backpack'&&ctx.getItemQty('backpack')===0);
assert('Equipped accessory is persisted in pet record',()=>ctx.state.petRecords.poring_egg.some(x=>x.petUid==='pet-poring-test'&&x.petAccessory==='backpack'));
assert('Equipped accessory survives a JSON save/load round trip',()=>{
 const restored=JSON.parse(JSON.stringify(ctx.state.petRecords));
 return restored.poring_egg.some(x=>x.petUid==='pet-poring-test'&&x.petAccessory==='backpack');
});

assert('Accessory can be unequipped back into inventory',()=>ctx.unequipPetAccessory466()&&!ctx.state.pet.petAccessory&&ctx.getItemQty('backpack')===1);
assert('Incompatible accessory is rejected without consumption',()=>ctx.equipPetAccessory466('red_chorker_bell')===false&&ctx.getItemQty('backpack')===1);
// Poring -> Mastering evolution.
ctx.state.pet={eggId:'poring_egg',petUid:'pet-poring-evo',name:'Poring Evo',intimacy:950,hunger:73,named:true,autoFeed:true,autoBuyReserve:12345};
ctx.state.petRecords={poring_egg:[JSON.parse(JSON.stringify(ctx.state.pet))]};
ctx.state.inventory=[{item:'leaf_of_yggdrasil',qty:10},{item:'unripe_apple',qty:3}];
assert('Evolution succeeds with correct materials and keeps individual identity',()=>{
 const ok=ctx.evolvePet466('poring_to_mastering');
 return ok&&ctx.state.pet.eggId==='mastering_egg'&&ctx.state.pet.petUid==='pet-poring-evo'&&ctx.state.pet.name==='Poring Evo'&&ctx.state.pet.intimacy===950&&ctx.state.pet.hunger===73&&ctx.state.pet.autoFeed===true;
});
assert('Evolution consumes exactly the recipe materials',()=>ctx.getItemQty('leaf_of_yggdrasil')===0&&ctx.getItemQty('unripe_apple')===0);
assert('Evolution moves pet record to the evolved egg index',()=>!ctx.state.petRecords.poring_egg&&ctx.state.petRecords.mastering_egg.some(x=>x.petUid==='pet-poring-evo'));
// No consumption if not loyal, accessory equipped, or missing materials.
ctx.state.pet={eggId:'mastering_egg',petUid:'not-loyal',name:'',intimacy:909,hunger:90,named:false};
ctx.state.inventory=[{item:'spirit_chain',qty:1},{item:'white_herb',qty:50},{item:'yellow_potion',qty:20},{item:'jellopy',qty:200}];
assert('Evolution blocked at intimacy 909 without consuming materials',()=>!ctx.evolvePet466('mastering_to_angeling')&&ctx.getItemQty('jellopy')===200);
ctx.state.pet.intimacy=910;
assert('Evolution becomes available exactly at intimacy 910',()=>ctx.evolvePet466('mastering_to_angeling')&&ctx.state.pet.eggId==='angeling_egg');
ctx.state.pet={eggId:'mastering_egg',petUid:'accessory-evo',name:'',intimacy:950,hunger:90,named:false,petAccessory:'backpack'};
ctx.state.inventory=[{item:'spirit_chain',qty:1},{item:'white_herb',qty:50},{item:'yellow_potion',qty:20},{item:'jellopy',qty:200}];
assert('Evolution auto-unequips accessory back to inventory',()=>ctx.evolvePet466('mastering_to_angeling')&&ctx.state.pet.eggId==='angeling_egg'&&ctx.state.pet.petAccessory===null&&ctx.getItemQty('backpack')===1);
ctx.state.pet={eggId:'mastering_egg',petUid:'missing-materials',name:'',intimacy:950,hunger:90,named:false};
ctx.state.inventory=[{item:'spirit_chain',qty:1}];
assert('Missing evolution materials do not partially consume any items',()=>!ctx.evolvePet466('mastering_to_angeling')&&ctx.getItemQty('spirit_chain')===1);
assert('Evolution page is included in pet center navigation',()=>{
  ctx.renderPetCenter=actualPetCenterRender;
  ctx.switchPetCenterView('evolution');
  return ctx.petHost.innerHTML.includes('寵物進化') && ctx.petHost.innerHTML.includes('確認進化');
});
console.log(`v2.5.470 pet evolution/accessory checks passed (${checks.length}):\n- `+checks.join('\n- '));
