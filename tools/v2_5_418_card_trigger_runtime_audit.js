const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
const files=['skills.js','monster_skills.js','jobs.js','hp_sp_tables.js','aspd_data.js','data.js','img_alias.js','v2_5_392_card_catalog_repair.js','v2_5_394_card_catalog_audit.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','v2_5_247_weapon_batch.js','v2_5_248_thanos_size_damage_fix.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','v2_5_233_balance.js','v321_ep21_drops_and_images.js','v2_5_397_card_catalog_batch.js','v2_5_398_card_catalog_batch.js','v2_5_399_card_catalog_batch.js','v2_5_400_ep21_card_completion.js','v2_5_402_ep21_encroached_tan_card.js','v2_5_403_ep21_missing_cards.js','v2_5_395_card_set_codex.js','v2_5_396_card_set_codex.js','v2_5_404_ep20_card_effect_completion.js','v2_5_405_ep19_album_gap_completion.js','v2_5_406_ep19_card_completion.js','v2_5_407_ep19_card_effect_and_catalog.js','v2_5_408_ep21_winter_card_runtime_fix.js','v2_5_409_legacy_card_runtime_data.js','v2_5_410_legacy_card_completion.js','v2_5_412_remaining_2026_card_batch.js','v2_5_413_card_catalog_repair.js','v2_5_414_whikebain_rogue_combo_fix.js','v2_5_415_poplab_card_pages5_6.js','v2_5_418_poplab_card_pages7_15.js','v2_5_419_poplab_card_page16.js','v2_5_420_poplab_card_page17.js','v2_5_421_poplab_final_remaining_cards.js','engine.js'];
for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);

const cards=Object.entries(run('CARDS'));
const slotMap={weapon:'weapon',armor:'armor',shield:'shield',headgear:'head_top',garment:'garment',footgear:'footgear',accessory:'accessory1',any:'weapon'};
const report={checked:0,events:{autoSpell:0,ailment:0,onAttackBuff:0,killDrop:0,grantSkill:0},failures:[]};
for(const [id,card] of cards){
 const has=['autoSpell','ailment','onAttackBuff','killDrop','grantSkill'].some(k=>(card[k]||[]).length);
 if(!has) continue;
 const slot=slotMap[card.slot]||'weapon', type=slot==='weapon'?'weapon':'armor';
 const armorType=slot==='shield'?'shield':(slot==='armor'?'armor':(slot.startsWith('head_')?'headgear':slot==='garment'?'garment':slot==='footgear'?'footgear':'accessory'));
 for(const refine of [0,10]){
  run("ITEMS.__audit_item={id:'__audit_item',type:'"+type+"',armorType:'"+armorType+"',weaponType:'staff',weaponLv:5,armorLevel:2,slots:4,desc:'防具等級: 2'};");
  run("state={equip:{'"+slot+"':'__audit_inst'},instances:{__audit_inst:{item:'__audit_item',refine:"+refine+",cards:['"+id+"']}},stats:{str:50,agi:50,vit:50,int:50,dex:50,luk:50},baseLevel:200,jobLevel:70,jobId:'knight',learnedSkills:{},traitAlloc:{},hp:1000,sp:100,maxHp:1000,maxSp:100,buffs:[],monsters:[],inventory:[]};_gearBonusCache=null;_gearBonusKey='';");
  try{run('recomputeDerived()')}catch(e){report.failures.push({id,refine,error:String(e)});continue;}
  const lo=run('buildLoadout()'), host=lo.cardHosts[id]?.[0];
  const expected={autoSpell:[],ailment:[],onAttackBuff:[],killDrop:[],grantSkill:[]};
  for(const field of ['autoSpell','ailment','onAttackBuff','killDrop']){
   for(const ev of card[field]||[]){
    if(ev.when && !run("condMet("+JSON.stringify(ev.when)+","+JSON.stringify(host)+",buildLoadout())")) continue;
    expected[field].push(ev);
   }
  }
  for(const field of ['autoSpell','ailment','onAttackBuff']){
   const actual=field==='autoSpell'?run('state.cardAutoSpells'):field==='ailment'?run('state.cardAilments'):run('state.cardAttackBuffs');
   for(const ev of expected[field]){
    report.events[field]++;
    const arr=actual[ev.on]||[];
    if(!arr.some(x=>x.skill===ev.skill && x.ailment===ev.ailment && x.chance===ev.chance && x.buff===ev.buff)) report.failures.push({id,refine,field,event:ev,actual:arr});
   }
  }
  const actualDrops=run('state.cardKillDrops');
  for(const ev of expected.killDrop){
   report.events.killDrop++;
   if(!actualDrops.some(x=>JSON.stringify(x)===JSON.stringify(ev))) report.failures.push({id,refine,field:'killDrop',event:ev,actual:actualDrops});
  }
  const skills=run('state.cardSkills||{}');
  for(const g of card.grantSkill||[]){
   report.events.grantSkill++;
   if((skills[g.id]||0)<(g.lv||1)) report.failures.push({id,refine,field:'grantSkill',event:g,actual:skills});
  }
  report.checked++;
 }
}
if(report.failures.length) throw new Error('Card trigger runtime audit failures: '+JSON.stringify(report.failures.slice(0,20)));
if(report.checked!==292) throw new Error('Unexpected trigger audit coverage: '+report.checked);
console.log(JSON.stringify({cardCases:report.checked,events:report.events,failures:report.failures.length,result:'passed'}));
