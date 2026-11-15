const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/'));
const end=files.indexOf('js/engine.js');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);for(const f of files.slice(0,end+1))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx), C=run('CARDS'), J=run('JOB_TREE');
const ids=['geographer_card','grand_peco_card','dark_lord_card','dark_priest_card','lude_card','violy_card','wander_man_card','ancient_mummy_card','injustice_card','quve_card','cramp_card','whikebain_card','byorgue_card','iara_card','loli_ruri_card'];
const slotMap={weapon:'weapon',armor:'armor',shield:'shield',headgear:'head_top',garment:'garment',footgear:'footgear',accessory:'accessory1',any:'weapon'};
function jobFor(when){
 if(when.jobIs)return Array.isArray(when.jobIs)?when.jobIs[0]:when.jobIs;
 if(when.jobLine){
  for(const job of Object.keys(J)){
   run(`state={jobId:${JSON.stringify(job)}}`);
   if(run('getAllLearnedJobs()').includes(when.jobLine))return job;
  }
  throw new Error('no job for line '+when.jobLine);
 }
 return 'knight';
}
const tests=[];
for(const id of ids){
 const card=C[id],slot=slotMap[card.slot]||'weapon';
 for(let i=0;i<(card.condBonus||[]).length;i++){
  const cb=card.condBonus[i],when=cb.when||{};
  const companions=[...(when.withCards||[])];
  const savedCompanions=companions.map(other=>({id:other,def:run(`CARDS[${JSON.stringify(other)}]`)}));
  // Keep companion IDs equipped for condMet(), but neutralize their own bonuses so the delta isolates this card's branch.
  for(const other of companions)run(`CARDS[${JSON.stringify(other)}]={...CARDS[${JSON.stringify(other)}],bonus:{},condBonus:[],autoSpell:[],ailment:[],onAttackBuff:[],killDrop:[],grantSkill:[]}`);
  const job=jobFor(when);
  const armorType=slot==='shield'?'shield':slot==='armor'?'armor':slot.startsWith('head_')?'headgear':slot==='garment'?'garment':slot==='footgear'?'footgear':'accessory';
  run(`ITEMS.__audit_host={id:'__audit_host',type:${JSON.stringify(slot==='weapon'?'weapon':'armor')},armorType:${JSON.stringify(armorType)},weaponType:'staff',weaponCat:'rod',weaponLv:5,armorLevel:2,slots:4,desc:'防具等級: 2'};`);
  const equip={};equip[slot]='__audit_inst';
  const instances={__audit_inst:{item:'__audit_host',refine:0,cards:companions}};
  run(`state={equip:${JSON.stringify(equip)},instances:${JSON.stringify(instances)},stats:{str:50,agi:50,vit:50,int:50,dex:50,luk:50},baseLevel:200,jobLevel:70,jobId:${JSON.stringify(job)},learnedSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[]};_gearBonusCache=null;_gearBonusKey='';`);
  run(`state.instances.__audit_inst.cards=${JSON.stringify([...companions,id])};_gearBonusCache=null;_gearBonusKey='';`);
  const lo=run('buildLoadout()'),host=(lo.cardHosts[id]||[])[0];
  assert.ok(host, id+' host');
  assert.strictEqual(run(`condMet(${JSON.stringify(when)}, buildLoadout().cardHosts[${JSON.stringify(id)}][0], buildLoadout())`),true,id+' condMet '+i);
  const actual=run('effectiveGearBonuses()');
  run(`state.instances.__audit_inst.cards=${JSON.stringify(companions)};_gearBonusCache=null;_gearBonusKey='';`);
  const baseline=run('effectiveGearBonuses()');
  for(const [key,value] of Object.entries(cb.bonus||{})){
   const canonical=run(`canonicalBonusKey(${JSON.stringify(key)})`);
   const expected=(String(key).toLowerCase()==='aftercastpct'?-value:value);
   const delta=(actual[canonical]||0)-(baseline[canonical]||0);
   assert.ok(Math.abs(delta-expected)<1e-8,`${id} ${i} ${canonical}: expected ${expected}, got ${delta}`);
  }
  tests.push(id+':'+i);
  for(const saved of savedCompanions)run(`CARDS[${JSON.stringify(saved.id)}]=${JSON.stringify(saved.def)}`);
 }
}
console.log(JSON.stringify({passed:tests.length,tests}));
