const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
const files=['skills.js','monster_skills.js','jobs.js','data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','v2_5_413_card_catalog_repair.js','v2_5_414_whikebain_rogue_combo_fix.js','v2_5_415_poplab_card_pages5_6.js','v2_5_418_poplab_card_pages7_15.js','v2_5_419_poplab_card_page16.js','v2_5_420_poplab_card_page17.js','v2_5_421_poplab_final_remaining_cards.js','engine.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);

const engine=fs.readFileSync(path.join(root,'js','engine.js'),'utf8');
const cards=Object.entries(run('CARDS'));
const slotMap={weapon:'weapon',armor:'armor',shield:'shield',headgear:'head_top',garment:'garment',footgear:'footgear',accessory:'accessory1',any:'weapon'};
const report={total:cards.length,checked:0,checks:0,failures:[],cardsWithoutEffect:[],unimplemented:[],procOnly:[]};
function norm(k,v){return {key:run("canonicalBonusKey("+JSON.stringify(k)+")"),value:(String(k).toLowerCase()==='aftercastpct'?-v:v)};}
for(const [id,card] of cards){
 const slot=slotMap[card.slot]||'weapon';
 const type=slot==='weapon'?'weapon':'armor';
 const armorType=slot==='shield'?'shield':(slot==='armor'?'armor':(slot.startsWith('head_')?'headgear':slot==='garment'?'garment':slot==='footgear'?'footgear':'accessory'));
 for(const refine of [0,10]){
  run("ITEMS.__audit_item={id:'__audit_item',type:'"+type+"',armorType:'"+armorType+"',weaponType:'staff',weaponLv:5,armorLevel:2,slots:4,desc:'防具等級: 2'};");
  run("state={equip:{'"+slot+"':'__audit_inst'},instances:{__audit_inst:{item:'__audit_item',refine:"+refine+",cards:['"+id+"']}},stats:{str:99,agi:99,vit:99,int:99,dex:99,luk:99},baseLevel:200,jobLevel:70,jobId:'knight',learnedSkills:{},traitAlloc:{}};_gearBonusCache=null;_gearBonusKey='';");
  const lo=run('buildLoadout()');
  const host=lo.cardHosts[id]?.[0];
  const exp={};
  const add=(k,v)=>{const n=norm(k,v);exp[n.key]=(exp[n.key]||0)+n.value;};
  for(const [k,v] of Object.entries(card.bonus||{})) if(typeof v==='number') add(k,v);
  if(card.perRefine) for(const [k,v] of Object.entries(card.perRefine)) if(typeof v==='number') add(k,v*Math.min(refine,card.perRefineCap??refine));
  for(const [field,step] of [['per1Refine',1],['per2Refine',2],['per3Refine',3],['per4Refine',4],['per5Refine',5]]){
    const rule=card[field]; if(!rule) continue;
    const r=Math.min(refine,card.perRefineCap??refine);
    const start=field==='per1Refine'?Math.max(1,Number(card.per1RefineStart)||1):1;
    const count=field==='per1Refine'?Math.max(0,r-start+1):Math.floor(r/step);
    if(count>0) for(const [k,v] of Object.entries(rule)) if(typeof v==='number') add(k,v*count);
  }
  for(const cb of (card.condBonus||[])){
    if(!run("condMet("+JSON.stringify(cb.when||null)+", "+JSON.stringify(host)+", buildLoadout())")) continue;
    let hasPer=false;
    for(const [k,v] of Object.entries(cb.bonus||{})){
      const pm=/^per(\d+)Refine_(.+)$/.exec(k);
      if(pm){const count=Math.floor(refine/Number(pm[1]));if(count>0)add(pm[2],v*count);hasPer=true;}
      else if(/^perItem\d+Refine_/.test(k)){hasPer=true;}
      else if(typeof v==='number') add(k,v);
    }
  }
  const got=run('effectiveGearBonuses()');
  for(const [k,v] of Object.entries(exp)){
    report.checks++;
    const actual=got[k]||0;
    if(Math.abs(actual-v)>1e-8) report.failures.push({id,refine,key:k,expected:v,actual});
  }
  report.checked++;
 }
 if((card.unimplemented||[]).length) report.unimplemented.push({id,name:card.name,items:card.unimplemented});
 if(!Object.keys(card.bonus||{}).length && !(card.condBonus||[]).length && !card.perRefine && !card.per1Refine && !card.per2Refine && !card.per3Refine && !card.per4Refine && !card.per5Refine) report.procOnly.push({id,name:card.name,fields:Object.keys(card).filter(k=>!['id','name','icon','slot','desc','monsterId','source'].includes(k))});
}
const bonusKeys=[...new Set(cards.flatMap(([id,c])=>Object.keys(c.bonus||{})))];
const dynamicConsumers=['armorEle_','eleDmg_','raceDmg_','sizeDmg_','familyDmg_','familyDmgTaken_','raceDmgTaken_','monDmg_','eleReduce_','eleDmgReduce_','raceDmgReduce_','sizeDmgReduce_','ailResist_','expRace_','spOnKillRace_','itemHeal_','raceCrit_','defIgnoreRace_','magicEleDmg_','magicRaceDmg_','magicSizeDmg_','skillCd_','cooldown_','skillCdFlat_','spCost_','skillDmg_','perBaseLv','perJobLv','perStat_','perSkill_'];
const unconsumed=bonusKeys.filter(raw=>{const key=run("canonicalBonusKey("+JSON.stringify(raw)+")");return !engine.includes(key)&&!dynamicConsumers.some(p=>key.startsWith(p)&&engine.includes(p));});
if(unconsumed.length) throw new Error('Bonus keys without an engine consumer: '+unconsumed.join(','));
if(report.failures.length) throw new Error('Card bonus runtime audit failures: '+JSON.stringify(report.failures.slice(0,20)));
if(report.total!==867 || report.checked!==1734) throw new Error('Unexpected card inventory/runtime coverage: '+JSON.stringify({total:report.total,checked:report.checked}));
console.log(JSON.stringify({total:report.total,checked:report.checked,numericAndConditionalChecks:report.checks,uniqueBonusKeys:bonusKeys.length,unconsumedBonusKeys:unconsumed.length,failures:report.failures.length,unimplementedCards:report.unimplemented.length,procOnlyCards:report.procOnly.length,result:'passed'}));
