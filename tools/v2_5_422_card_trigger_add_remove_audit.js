
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

const cards=Object.entries(run('CARDS')),slotMap={weapon:'weapon',armor:'armor',shield:'shield',headgear:'head_top',garment:'garment',footgear:'footgear',accessory:'accessory1',any:'weapon'};
const report={triggerCards:0,checked:0,registrationErrors:[],removalErrors:[],counts:{autoSpell:0,ailment:0,onAttackBuff:0,onAttackResource:0,killDrop:0,grantSkill:0}};
for(const[id,c]of cards){
 const has=['autoSpell','ailment','onAttackBuff','onAttackResource','killDrop','grantSkill'].some(k=>(c[k]||[]).length);
 if(!has)continue; report.triggerCards++;
 const slot=slotMap[c.slot]||'weapon';
 const armorType=slot==='shield'?'shield':slot==='armor'?'armor':slot.startsWith('head_')?'headgear':slot==='garment'?'garment':slot==='footgear'?'footgear':'accessory';
 for(const refine of [0,10]){
  run("ITEMS.__audit_host={id:'__audit_host',type:'"+(slot==='weapon'?'weapon':'armor')+"',armorType:'"+armorType+"',weaponType:'staff',weaponCat:'rod',weaponLv:5,armorLevel:2,slots:4,desc:'防具等級: 2'};");
  run("state={equip:{'"+slot+"':'__audit_inst'},instances:{__audit_inst:{item:'__audit_host',refine:"+refine+",cards:['"+id+"']}},stats:{str:50,agi:50,vit:50,int:50,dex:50,luk:50},baseLevel:200,jobLevel:70,jobId:'knight',learnedSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[]};_gearBonusCache=null;_gearBonusKey='';");
  run('recomputeDerived()');
  const lo=run('buildLoadout()'),host=(lo.cardHosts[id]||[])[0];
  const expected={autoSpell:[],ailment:[],onAttackBuff:[],onAttackResource:[],killDrop:[]};
  for(const f of ['autoSpell','ailment','onAttackBuff','onAttackResource','killDrop'])for(const ev of c[f]||[]){
   if(ev.when&&!run("condMet("+JSON.stringify(ev.when)+","+JSON.stringify(host)+",buildLoadout())"))continue;
   expected[f].push(ev);
  }
  const actual={autoSpell:run('state.cardAutoSpells'),ailment:run('state.cardAilments'),onAttackBuff:run('state.cardAttackBuffs'),onAttackResource:run('state.cardSpiritProcs'),killDrop:run('state.cardKillDrops'),grantSkill:run('state.cardSkills||{}')};
  for(const f of ['autoSpell','ailment','onAttackBuff']){
   for(const ev of expected[f]){report.counts[f]++;const arr=actual[f][ev.on]||[];if(!arr.some(x=>x.skill===ev.skill&&x.ailment===ev.ailment&&x.chance===ev.chance&&x.buff===ev.buff))report.registrationErrors.push({id,name:c.name,refine,field:f,event:ev});}
  }
  for(const ev of expected.onAttackResource){report.counts.onAttackResource++;if(!actual.onAttackResource.some(x=>JSON.stringify(x)===JSON.stringify(ev)))report.registrationErrors.push({id,name:c.name,refine,field:'onAttackResource',event:ev});}
  for(const ev of expected.killDrop){report.counts.killDrop++;if(!actual.killDrop.some(x=>JSON.stringify(x)===JSON.stringify(ev)))report.registrationErrors.push({id,name:c.name,refine,field:'killDrop',event:ev});}
  for(const g of c.grantSkill||[]){report.counts.grantSkill++;if((actual.grantSkill[g.id]||0)<(g.lv||1))report.registrationErrors.push({id,name:c.name,refine,field:'grantSkill',event:g});}
  // remove the card, recompute, and ensure none of its trigger entries/skills remain
  run("state.instances.__audit_inst.cards=[];_gearBonusCache=null;_gearBonusKey='';recomputeDerived()");
  const after={autoSpell:run('state.cardAutoSpells'),ailment:run('state.cardAilments'),onAttackBuff:run('state.cardAttackBuffs'),onAttackResource:run('state.cardSpiritProcs'),killDrop:run('state.cardKillDrops'),grantSkill:run('state.cardSkills||{}')};
  for(const f of ['autoSpell','ailment','onAttackBuff']){
   for(const ev of expected[f])if((after[f][ev.on]||[]).some(x=>x.skill===ev.skill&&x.ailment===ev.ailment&&x.chance===ev.chance&&x.buff===ev.buff))report.removalErrors.push({id,name:c.name,refine,field:f,event:ev});
  }
  for(const ev of expected.onAttackResource)if(after.onAttackResource.some(x=>JSON.stringify(x)===JSON.stringify(ev)))report.removalErrors.push({id,name:c.name,refine,field:'onAttackResource',event:ev});
  for(const ev of expected.killDrop)if(after.killDrop.some(x=>JSON.stringify(x)===JSON.stringify(ev)))report.removalErrors.push({id,name:c.name,refine,field:'killDrop',event:ev});
  for(const g of c.grantSkill||[])if((after.grantSkill[g.id]||0)>0)report.removalErrors.push({id,name:c.name,refine,field:'grantSkill',event:g});
  report.checked++;
 }
}
console.log(JSON.stringify(report));
