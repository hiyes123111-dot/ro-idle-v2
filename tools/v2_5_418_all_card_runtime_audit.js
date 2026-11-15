const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};ctx.window=ctx;vm.createContext(ctx);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/')).map(f=>path.basename(f));
const end=files.indexOf('engine.js');
if(end<0) throw new Error('engine.js missing from index.html');
const ordered=files.slice(0,end+1);
for(const f of ordered)vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);

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
console.log(JSON.stringify(report));
