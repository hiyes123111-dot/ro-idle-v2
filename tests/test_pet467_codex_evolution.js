const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const checks=[];
const assert=(name,fn)=>{if(!fn())throw new Error('FAIL '+name);checks.push(name);};
const listHost={innerHTML:''},pageHost={innerHTML:''};
const ctx={
 console,Date,Math,ITEMS:{},state:null,
 document:{getElementById:(id)=>id==='pet-center-codex-list'?listHost:pageHost},
 getItemQty:(id)=>((ctx.state.inventory||[]).find(x=>x.item===id)||{}).qty||0,
 logMsg:()=>{},saveGame:()=>{},recomputeDerived:()=>{},renderTopBar:()=>{},
 petSafeName:s=>String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])),
 refreshPetCenterIfOpen:()=>{},window:{}
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';globalThis.ITEMS=ITEMS;',ctx,{timeout:10000});
ctx.state={pet:null,inventory:[],petRecords:{},codex:{item:{}},gold:0};
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_462_pet_center.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_466_pet_evolution_accessories.js'),'utf8')+';globalThis.__recipes=PET_EVOLUTION_RECIPES_466;',ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/v2_5_467_pet_codex_evolution.js'),'utf8'),ctx);

assert('Codex/evolution bridge loads against the single recipe source',()=>ctx.petCodexEvolutionReady467()&&ctx.__recipes.length===6);
assert('Base pet codex entry displays evolution destination and materials',()=>{
 const html=ctx.renderPetEvolutionCodexInfo467('poring_egg');
 return html.includes('可進化為：波利之王')&&html.includes('天地樹葉子 ×10')&&html.includes('青蘋果 ×3');
});
assert('Evolved pet codex entry links back to its base species',()=>{
 const html=ctx.renderPetEvolutionCodexInfo467('mastering_egg');
 return html.includes('進化來源：波利')&&html.includes('親密度 910/1000');
});
assert('All six evolution relationships are discoverable in codex helpers',()=>{
 return ctx.__recipes.every(r=>ctx.renderPetEvolutionCodexInfo467(r.from).length>0&&ctx.renderPetEvolutionCodexInfo467(r.to).length>0);
});
assert('Evolution search index includes source and result species names',()=>{
 return ctx.pet467EvolutionSearchText('poring_egg').includes('波利之王')&&ctx.pet467EvolutionSearchText('mastering_egg').includes('波利');
});
assert('Evolution search index includes material names and IDs',()=>{
 return ctx.pet467EvolutionSearchText('poring_egg').includes('青蘋果')&&ctx.pet467EvolutionSearchText('poring_egg').includes('leaf_of_yggdrasil');
});
ctx.switchPetCenterView('codex');
assert('Pet codex renders evolution information inline',()=>{
 return listHost.innerHTML.includes('進化關聯')&&listHost.innerHTML.includes('可進化為：波利之王');
});
ctx.setPetCenterSearch('寵物奶嘴');
assert('Searching by pet accessory name returns the compatible pet species',()=>{
 return listHost.innerHTML.includes('小惡魔寵物蛋')&&listHost.innerHTML.includes('可用寵物飾品');
});
ctx.setPetCenterSearch('小鴨玩具的星星紐扣');
assert('Accessory search parses trailing item metadata and returns the correct pet',()=>{
 return listHost.innerHTML.includes('彷徨的小鴨玩具寵物蛋')&&listHost.innerHTML.includes('小鴨玩具的星星紐扣');
});
ctx.setPetCenterSearch('青蘋果');
assert('Searching by evolution material returns the correct base pet',()=>{
 return listHost.innerHTML.includes('波利寵物蛋')&&listHost.innerHTML.includes('可進化為：波利之王');
});
ctx.setPetCenterSearch('波利之王');
assert('Searching by evolved pet name returns both sides of the chain',()=>{
 return listHost.innerHTML.includes('波利寵物蛋')&&listHost.innerHTML.includes('波利之王寵物蛋');
});
ctx.state.pet={eggId:'mastering_egg',petUid:'codex-evolved-1',name:'波利之王 A',intimacy:950,hunger:50};
ctx.state.petRecords={mastering_egg:[{eggId:'mastering_egg',petUid:'codex-saved-1',name:'波利之王 B',intimacy:800,hunger:70}]};
ctx.setPetCenterSearch('波利之王');
assert('Active and saved evolved individuals remain represented in codex',()=>{
 return listHost.innerHTML.includes('目前出戰')&&listHost.innerHTML.includes('另有已保存 1 隻');
});
console.log(`v2.5.470 codex evolution checks passed (${checks.length}):\n- `+checks.join('\n- '));
