
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/'));
const end=files.indexOf('js/engine.js');
const ordered=files.slice(0,end+1);
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ordered) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);

const cards=Object.entries(run('CARDS'));
const slotMap={weapon:'weapon',armor:'armor',shield:'shield',headgear:'head_top',garment:'garment',footgear:'footgear',accessory:'accessory1',any:'weapon'};
const report={total:cards.length,registered:0,staticCards:0,triggerCards:0,emptyCards:[],unimplemented:[],slotErrors:[],hostErrors:[],effectErrors:[],removeErrors:[],conditionalNotHit:[],triggerFields:{autoSpell:0,ailment:0,onAttackBuff:0,onAttackResource:0,killDrop:0,grantSkill:0}};
const keysFor=c=>Object.keys(c.bonus||{}).length || (c.condBonus||[]).length || ['perRefine','per1Refine','per2Refine','per3Refine','per4Refine','per5Refine'].some(k=>c[k]) || !!c.runtimeEffect;
const hasTrigger=c=>['autoSpell','ailment','onAttackBuff','onAttackResource','killDrop','grantSkill'].some(k=>(c[k]||[]).length);
function norm(k,v){return {key:run("canonicalBonusKey("+JSON.stringify(k)+")"),value:(String(k).toLowerCase()==='aftercastpct'?-v:v)};}
function expectedFor(card,host,refine){
 const exp={}; const add=(k,v)=>{const n=norm(k,v);if(n.key)exp[n.key]=(exp[n.key]||0)+n.value;};
 for(const [k,v] of Object.entries(card.bonus||{}))if(typeof v==='number')add(k,v);
 if(card.perRefine)for(const [k,v]of Object.entries(card.perRefine))if(typeof v==='number')add(k,v*Math.min(refine,card.perRefineCap??refine));
 for(const [field,step]of [['per1Refine',1],['per2Refine',2],['per3Refine',3],['per4Refine',4],['per5Refine',5]]){
  const rule=card[field];if(!rule)continue;
  const r=Math.min(refine,card.perRefineCap??refine);
  const start=field==='per1Refine'?Math.max(1,Number(card.per1RefineStart)||1):1;
  const count=field==='per1Refine'?Math.max(0,r-start+1):Math.floor(r/step);
  if(count>0)for(const[k,v]of Object.entries(rule))if(typeof v==='number')add(k,v*count);
 }
 for(const cb of(card.condBonus||[])){
  if(!run("condMet("+JSON.stringify(cb.when||null)+", "+JSON.stringify(host)+", buildLoadout())"))continue;
  let hasPer=false;
  for(const[k,v]of Object.entries(cb.bonus||{})){
   const pm=/^per(\d+)Refine_(.+)$/.exec(k);
   if(pm){const count=Math.floor(refine/Number(pm[1]));if(count>0)add(pm[2],v*count);hasPer=true;}
   else if(/^perItem\d+Refine_/.test(k)){hasPer=true;}
   else if(typeof v==='number')add(k,v);
  }
 }
 return exp;
}
function reset(slot,cardId,refine){
 const armorType=slot==='shield'?'shield':slot==='armor'?'armor':slot.startsWith('head_')?'headgear':slot==='garment'?'garment':slot==='footgear'?'footgear':'accessory';
 run("ITEMS.__audit_host={id:'__audit_host',type:'"+(slot==='weapon'?'weapon':'armor')+"',armorType:'"+armorType+"',weaponType:'staff',weaponCat:'rod',weaponLv:5,armorLevel:2,slots:4,desc:'防具等級: 2'};");
 run("state={equip:{'"+slot+"':'__audit_inst'},instances:{__audit_inst:{item:'__audit_host',refine:"+refine+",cards:"+(cardId? "['"+cardId+"']":"[]")+"}},stats:{str:99,agi:99,vit:99,int:99,dex:99,luk:99},baseLevel:220,jobLevel:70,jobId:'knight',learnedSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[]};_gearBonusCache=null;_gearBonusKey='';");
}
for(const[id,c]of cards){
 const slot=slotMap[c.slot];
 if(!slot){report.slotErrors.push({id,name:c.name,slot:c.slot});continue;}
 const hasStatic=keysFor(c),hasProc=hasTrigger(c);
 if(hasStatic)report.staticCards++;
 if(hasProc)report.triggerCards++;
 if((c.unimplemented||[]).length)report.unimplemented.push({id,name:c.name,reason:c.unimplemented});
 if(!hasStatic&&!hasProc)report.emptyCards.push({id,name:c.name,desc:c.desc||''});
 for(const f of ['autoSpell','ailment','onAttackBuff','onAttackResource','killDrop','grantSkill'])report.triggerFields[f]+=(c[f]||[]).length;
 for(const refine of [0,10]){
  reset(slot,null,refine);
  const baseline=run('effectiveGearBonuses()');
  reset(slot,id,refine);
  const lo=run('buildLoadout()'),host=(lo.cardHosts[id]||[])[0];
  if(!host){report.hostErrors.push({id,name:c.name,refine,reason:'buildLoadout 未收錄 cardHosts'});continue;}
  report.registered++;
  const got=run('effectiveGearBonuses()');
  const exp=expectedFor(c,host,refine);
  for(const[k,v]of Object.entries(exp)){
   const actual=(got[k]||0)-(baseline[k]||0);
   if(Math.abs(actual-v)>1e-8)report.effectErrors.push({id,name:c.name,refine,key:k,expected:v,actual});
  }
  // Remove the card and ensure its numeric contribution is completely gone.
  reset(slot,null,refine);
  const removed=run('effectiveGearBonuses()');
  const all=new Set([...Object.keys(baseline),...Object.keys(removed)]);
  for(const k of all)if(Math.abs((baseline[k]||0)-(removed[k]||0))>1e-8){
   report.removeErrors.push({id,name:c.name,refine,key:k,before:baseline[k]||0,after:removed[k]||0});
  }
  if(refine===10 && c.condBonus?.length && !Object.keys(exp).length){
   report.conditionalNotHit.push({id,name:c.name,conditions:c.condBonus.map(x=>x.when||{})});
  }
 }
}
console.log(JSON.stringify(report));
