const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const baseBonuses={baseOnly:7};
const ctx={
  console,Date,Math,ITEMS:{},
  state:{pet:null,petRecords:{poring_egg:[{petUid:'archived-poring',eggId:'poring_egg',intimacy:950},{petUid:'archived-mastering',eggId:'mastering_egg',intimacy:950}]}},
  effectiveGearBonuses:()=>({...baseBonuses}),
  recomputeDerived:()=>{},logMsg:()=>{},saveGame:()=>true,saveGameThrottled:()=>true,
  getItemQty:()=>0,removeItem:()=>false,addItem:()=>{}
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';globalThis.ITEMS=ITEMS;',ctx);
for(const f of [
 'js/v2_5_456_pet_system.js','js/v2_5_457_pet_effect_completion.js','js/v2_5_458_pet_trigger_skills.js',
 'js/v2_5_459_pet_proc_completion.js','js/v2_5_460_tamadora_auto_heal.js','js/v2_5_461_cat_nine_tail_recovery.js',
 'js/v2_5_468_pet_proc_accuracy.js','js/v2_5_469_pet_battle_pipeline.js','js/v2_5_470_pet_combat_recovery.js',
 'js/v2_5_471_phreeoni_pet_proc_tier.js','js/v2_5_472_pet_combat_proc_completion.js','js/v2_5_473_pet_offline_care.js'
]) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const checks=[];
function check(name,fn){if(!fn())throw new Error('FAIL: '+name);checks.push(name);}
const direct=new Set(['str','agi','vit','int','dex','luk','atk','matk','hit','flee','def','critRate','hp','sp','atkPct','matkPct','hpPct','spPct','perfectDodge']);
const unsupported=new Set(['variableCastPct','skillAfterDelayPct']);
const levels=[100,250,500,750,909,910,950];
let matrix=0,keysSeen=new Set();
for(const eggId of ctx.petEggIds()) for(const intimacy of levels){
  ctx.state.pet={eggId,intimacy,petUid:`active-${eggId}`};
  const parsed=ctx.petParsedBonus(eggId,intimacy);
  const first=ctx.effectiveGearBonuses();
  const second=ctx.effectiveGearBonuses();
  if(first.baseOnly!==7||second.baseOnly!==7) throw new Error(`FAIL: base bonus lost at ${eggId}/${intimacy}`);
  for(const [key,value] of Object.entries(parsed)){
    keysSeen.add(key);
    if(direct.has(key)||unsupported.has(key)){
      if(Object.prototype.hasOwnProperty.call(first,key)) throw new Error(`FAIL: direct/unsupported key leaked into shared map ${eggId}/${intimacy}/${key}`);
    } else {
      if(Number(first[key]||0)!==Number(value)||Number(second[key]||0)!==Number(value))
        throw new Error(`FAIL: generic key missing or accumulated ${eggId}/${intimacy}/${key}: ${first[key]} vs ${value}`);
    }
  }
  matrix++;
}
check('All active pet bonuses map exactly once across every egg and intimacy boundary',()=>matrix===ctx.petEggIds().length*levels.length&&keysSeen.size>=50);
check('Archived pet records never stack their passive bonuses onto the active pet',()=>{
  ctx.state.pet={eggId:'poring_egg',intimacy:950,petUid:'active-one'};
  return ctx.getPetBonus('luk')===3&&ctx.getPetBonus('critRate')===1&&ctx.getPetBonus('agi')===0;
});
check('Switching active pet updates shared bonuses immediately without cache residue',()=>{
  ctx.state.pet={eggId:'mastering_egg',intimacy:950,petUid:'active-two'};
  const a=ctx.getPetBonus('luk')===3&&ctx.getPetBonus('critRate')===3;
  ctx.state.pet={eggId:'poring_egg',intimacy:950,petUid:'active-one'};
  const b=ctx.getPetBonus('luk')===3&&ctx.getPetBonus('critRate')===1;
  return a&&b&&ctx.effectiveGearBonuses().baseOnly===7;
});
check('No active pet removes all pet-only generic bonuses',()=>{
  ctx.state.pet=null;
  const map=ctx.effectiveGearBonuses();
  return ctx.getPetBonus('luk')===0&&ctx.getPetBonus('critRate')===0&&Object.keys(map).length===1&&map.baseOnly===7;
});
check('Character stat panel renders pet as a separate source, not as gear/card',()=>{
  const ui=fs.readFileSync(path.join(root,'js/ui.js'),'utf8');
  const engine=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
  return ui.includes('title="寵物加成"')&&engine.includes('pet: petV')&&engine.includes("getPetBonus('str')");
});
check('Derived stat and battle paths consume direct and shared pet bonuses through distinct routes',()=>{
  const engine=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
  return engine.includes("getPetBonus('atk')")&&engine.includes("getPetBonus('hpPct')")&&
    engine.includes("getCardBonus('pAtk')")&&engine.includes("getCardBonus('sMatk')")&&
    engine.includes("getCardBonus('afterAttackDelayPct')");
});
check('Pet lifecycle operations recompute derived stats after hatch, restore, return, feed and evolution',()=>{
  const pet=fs.readFileSync(path.join(root,'js/v2_5_456_pet_system.js'),'utf8');
  const evo=fs.readFileSync(path.join(root,'js/v2_5_466_pet_evolution_accessories.js'),'utf8');
  return (pet.match(/recomputeDerived\(false\)/g)||[]).length>=4&&evo.includes('recomputeDerived(false)');
});
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const version=fs.readFileSync(path.join(root,'VERSION.txt'),'utf8').trim();
check('v2.5.481 release assets and runtime cache versions are synchronized',()=>{
  const versions=[...html.matchAll(/[?&]v=([^"'&]+)/g)].map(m=>m[1]);
  return versions.length>0&&versions.every(v=>v==='2.5.481')&&sw.includes('ro-idle-runtime-v2.5.481')&&version==='v2.5.481';
});
console.log(`v2.5.481 pet bonus integration checks passed (${checks.length+matrix}): ${matrix} egg/tier matrix cases + ${checks.length} integration checks; ${keysSeen.size} distinct bonus keys.`);
