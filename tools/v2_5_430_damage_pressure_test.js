const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),jsDir=path.join(root,'js'),storage=Object.create(null);
const documentStub={addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{classList:{add(){},remove(){}},appendChild(){}}};
const ctx={console,Date,Math,JSON,Object,Array,Set,Map,Number,String,RegExp,Float64Array,
setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},
localStorage:{getItem(k){return Object.prototype.hasOwnProperty.call(storage,k)?storage[k]:null},setItem(k,v){storage[k]=String(v)},removeItem(k){delete storage[k]}},
window:{addEventListener(){},location:{}},document:documentStub,navigator:{},performance:{now:()=>0},alert(){},confirm:()=>true,prompt:()=>null,URL,Blob,FileReader:function(){},Image:function(){},requestAnimationFrame:()=>0};
ctx.window.window=ctx.window;ctx.window.document=documentStub;vm.createContext(ctx);
const scripts=['about.js','hp_sp_tables.js','img_alias.js','aspd_data.js','skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_artifacts.js','achievements.js','engine.js','ui.js'];
for(const f of scripts) vm.runInContext(fs.readFileSync(path.join(jsDir,f),'utf8'),ctx,{filename:f,timeout:60000});
vm.runInContext(`showDamageFloat=()=>{};showDamageFloatAt=()=>{};showPlayerFloat=()=>{};showElementFloat=()=>{};playSkillSound=()=>{};showSkillCastEffect=()=>{};playHitSound=()=>{};playAttackSound=()=>{};`,ctx);
const run=s=>vm.runInContext(s,ctx);

const JOB_TREE=run('JOB_TREE'), SKILLS=run('SKILLS');
const jobs=["cardinal", "dragon_knight", "imperial_guard", "arch_mage", "element_master", "wind_hawk", "troubadour", "trouvere", "meister", "biolo", "shadow_cross", "abyss_chaser", "inquisitor"], weapons={"cardinal": "adulter_f_bible", "dragon_knight": "poenitentia_catapulta", "imperial_guard": "g_knight_spear", "arch_mage": "staff_170", "element_master": "adulter_f_m_book", "wind_hawk": "thanos_bow_ad", "troubadour": "ep172_1h_inst", "trouvere": "thanos_whip_ad", "meister": "g_knight_battleaxe", "biolo": "coolant_injection", "shadow_cross": "thanos_katar_ad", "abyss_chaser": "adulter_f_dagger", "inquisitor": "poenitentia_caestus"}, categories={"cardinal": "magic", "dragon_knight": "melee", "imperial_guard": "melee", "arch_mage": "magic", "element_master": "magic", "wind_hawk": "ranged", "troubadour": "ranged", "trouvere": "ranged", "meister": "melee", "biolo": "melee", "shadow_cross": "melee", "abyss_chaser": "melee", "inquisitor": "melee"};
const gearItems={
 head_top:'helm_of_mid_sol_god',head_mid:'old_moroc_acc',head_bottom:'temporal_sprout_tw',
 armor:'temporal_armor_lt_tw',garment:'temporal_cape_lt_tw',footgear:'temporal_boots_lt_tw',
 accessory1:'temporal_ring_tw_lt',accessory2:'magingiorde'
};
const cardSets={
 melee:{weapon:['suspicious_iwin_soldier_card','suspicious_iwin_soldier_card'],head:['shining_seaweed_ep19_card'],armor:[],garment:['sanctuary_cleaning_chief_card'],foot:[],acc:['angel_iceslug_card']},
 ranged:{weapon:['ill_kraken_card','ill_kraken_card'],head:['sea_butterfly_ep19_card'],armor:[],garment:['snow_angel_card'],foot:[],acc:['rabbit_iceslug_card']},
 magic:{weapon:['superior_rgan_warlock_card','superior_rgan_healer_card'],head:['ice_gangu_ep19_card'],armor:['nahtzigger_card'],garment:['sagittarius_ep19_card'],foot:[],acc:['jormungandr_church_wizard_card']}
};
const jobStatRole={};
function cardFor(slot,role,element){
 if(role!=='magic'){const s=cardSets[role];return slot==='weapon'?s.weapon:slot==='head_top'||slot==='head_mid'?s.head:slot==='armor'?s.armor:slot==='garment'?s.garment:slot==='footgear'?s.foot:slot==='accessory1'?s.acc:[];}
 const w=['fire','wind','earth'].includes(element)?'superior_rgan_warlock_card':
   ['water','poison','holy'].includes(element)?'superior_rgan_healer_card':'jormungandr_guardian_card';
 const a=['fire','wind','earth'].includes(element)?'bigmouth_iceslug_card':
   ['water','poison','holy'].includes(element)?'jormungandr_church_wizard_card':
   element==='ghost'?'discarded_medium_rgan_ep19_card':
   element==='shadow'?'discarded_primitive_rgan_ep19_card':'icebear_card';
 if(slot==='weapon')return [w,w];
 if((slot==='head_top'||slot==='head_mid')&&element==='water')return ['ice_gangu_ep19_card'];
 if(slot==='armor'&&element==='ghost')return ['nahtzigger_card'];
 if(slot==='garment'&&element==='poison')return ['sagittarius_ep19_card'];
 if(slot==='accessory1')return [a];
 return [];
}
function makeState(job,weapon,role,element){
 const ids=(JOB_TREE[job].skills||[]).map(s=>s.id);
 const learned={};for(const id of ids){const sk=SKILLS[id];if(sk)learned[id]=sk.maxLv||((JOB_TREE[job].skills||[]).find(x=>x.id===id)?.maxLv)||1;}
 const instances={};
 for(const [slot,item] of Object.entries(gearItems)){
   const key=({head_top:'ht',head_mid:'hm',head_bottom:'hb',armor:'ar',garment:'ga',footgear:'ft',accessory1:'ac',accessory2:'ab'})[slot];
   instances[key]={item,refine:20,grade:'A',cards:cardFor(slot,role,element)};
 }
 instances.we={item:weapon,refine:20,grade:'D',cards:cardFor('weapon',role,element)};
 const physical=role!=='magic';
 const traitStats=physical?{pow:100,spl:0,con:100,sta:0,wis:0,crt:100}:{pow:0,spl:100,con:100,sta:0,wis:100,crt:0};
 return {
  jobId:job,baseLevel:250,jobLevel:60,stats:{str:120,agi:120,vit:120,int:120,dex:120,luk:120},
  traitAlloc:{...traitStats},traitStats:{...traitStats},
  equip:{head_top:'ht',head_mid:'hm',head_bottom:'hb',weapon:'we',armor:'ar',garment:'ga',footgear:'ft',accessory1:'ac',accessory2:'ab'},
  instances,relics:{},learnedSkills:learned,cardSkills:{},inventory:[],gold:0,hp:100000,maxHp:100000,sp:100000,maxSp:100000,
  buffs:[],monsters:[],cooldowns:{},dpsTracker:{},autoSkillConfig:{},jobHistory:{},jobLevelHistory:{},traitPoints:0,spirits:0,
  elementalSpirit:job==='element_master'?{element:element||'fire',expiresAt:Date.now()+3600000,highElementalSpirit:true,level:5,mode:'offensive'}:null
 };
}
const norm={id:'__normal_dummy',name:'標準木人',level:1,hp:1e15,atk:0,def:0,defSoft:0,mdef:0,element:'neutral',elementResistance:{none:100,water:100,earth:100,fire:100,wind:100,poison:100,holy:100,shadow:100,ghost:100,undead:100},race:'plant',size:'large',isBoss:false,hit:0,flee:0,hitReq:1,fleeReq:1};
const boss={...norm,id:'__boss_dummy',name:'高防首領木人',def:588,mdef:506,isBoss:true};
run(`MONSTERS.__normal_dummy=${JSON.stringify(norm)};MONSTERS.__boss_dummy=${JSON.stringify(boss)};Math.random=()=>0.999;`);
function damageFor(job,weapon,role,skillId,targetId,count=1){
 const preSk=SKILLS[skillId], element=preSk&&preSk.element||'none';
 run(`state=${JSON.stringify(makeState(job,weapon,role,element))};_gearBonusCache=null;_gearBonusKey='';recomputeDerived();`);
 const wok=run(`weaponReqMet(${JSON.stringify((SKILLS[skillId]||{}).requiresWeapon||null)})`);
 const sk=run(`SKILLS[${JSON.stringify(skillId)}]`);
 if(!sk) return null;
 if(sk.requiresWeapon && !wok) return null;
 const monsters=[];
 for(let i=0;i<count;i++) monsters.push({id:'t'+i,defId:targetId,hp:1e15,maxHp:1e15});
 run(`state.monsters=${JSON.stringify(monsters)};`);
 const before=run(`state.monsters.reduce((a,m)=>a+m.hp,0)`);
 const ok=run(`castSkill(${JSON.stringify(skillId)},{free:true,forceLv:${sk.maxLv||1}})`);
 const after=run(`state.monsters.reduce((a,m)=>a+m.hp,0)`);
 const dmg=Math.max(0,before-after);
 const cd=Array.isArray(sk.cooldown)?(sk.cooldown[(sk.maxLv||1)-1]||0):Number(sk.cooldown||0);
 const eff=run(`effectiveCooldownMs(${JSON.stringify(skillId)},${cd})`)/1000;
 const delay=Array.isArray(sk.afterDelay)?(sk.afterDelay[(sk.maxLv||1)-1]||0):Number(sk.afterDelay||0);
 const cadence=Math.max(1,eff,delay);
 return {skillId,name:sk.name,type:sk.type,element:sk.element||'none',damage:Math.round(dmg),cooldown:cd,effectiveCooldown:+eff.toFixed(3),afterDelay:delay,cadence:+cadence.toFixed(3),dps:Math.round(dmg/cadence),ok};
}
const results=[];
for(const job of jobs){
 const weapon=weapons[job],role=categories[job],skillRows=(JOB_TREE[job].skills||[]).map(x=>SKILLS[x.id]).filter(s=>s&&['damage','damage_aoe','magic','magic_aoe','magic_multi','damage_multi','damage_multihit'].includes(s.type));
 const eligible=skillRows;
 const roleForSkill=s=>{
   if(['magic','magic_aoe','magic_multi'].includes(s.type)) return 'magic';
   if(s.rangeType==='ranged'||['bow','instrument','whip','instrument_whip'].includes(s.requiresWeapon)) return 'ranged';
   return 'melee';
 };
 const rows=[];
 for(const sk of eligible){
   // Skip weapon-gated attacks when the chosen replacement weapon cannot legally use them.
   
   for(const target of ['__normal_dummy','__boss_dummy']){
     const skillRole=roleForSkill(sk);
     const d=damageFor(job,weapon,skillRole,sk.id,target,1);
     if(d&&d.ok&&d.damage>0) rows.push({...d,role:skillRole,target});
   }
 }
 const normal=rows.filter(x=>x.target==='__normal_dummy').sort((a,b)=>b.dps-a.dps)[0]||null;
 const bossBest=rows.filter(x=>x.target==='__boss_dummy').sort((a,b)=>b.dps-a.dps)[0]||null;
 const aoeRows=[];
 for(const sk of eligible.filter(s=>['damage_aoe','magic_aoe'].includes(s.type)||s.multiTarget)){
   const skillRole=roleForSkill(sk);
   const d=damageFor(job,weapon,skillRole,sk.id,'__normal_dummy',5);
   if(d&&d.ok&&d.damage>0) aoeRows.push({...d,role:skillRole});
 }
 const aoe=aoeRows.sort((a,b)=>b.dps-a.dps)[0]||null;
 // Snapshot final derived values and selected card bonuses for transparency.
 run(`state=${JSON.stringify(makeState(job,weapon,normal?normal.role:role,normal?normal.element:'none'))};_gearBonusCache=null;_gearBonusKey='';recomputeDerived();`);
 const stats=run(`({atk:state.atk,matk:state.matk,sMatk:state.sMatk,weapon:ITEMS[${JSON.stringify(weapon)}].name,weaponCat:aspdCategoryOf(${JSON.stringify(weapon)}),cards:{melee:getCardBonus('meleeDmgPct'),ranged:getCardBonus('rangedDmgPct'),magic:getCardBonus('magicDmgPct'),fire:getCardBonus('magicEleDmg_fire'),wind:getCardBonus('magicEleDmg_wind'),earth:getCardBonus('magicEleDmg_earth'),water:getCardBonus('magicEleDmg_water'),poison:getCardBonus('magicEleDmg_poison')}})`);
 results.push({job,name:JOB_TREE[job].name,role,weapon,stats,normal,boss:bossBest,aoe});
}
console.log(JSON.stringify(results,null,2));
