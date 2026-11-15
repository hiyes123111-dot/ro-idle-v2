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

const assert=require('assert');
const skillId='v25_element_master_1';
const sk=run(`SKILLS[${JSON.stringify(skillId)}]`);
assert.ok(sk,'Magic Book Mastery skill exists');
assert.strictEqual(sk.passiveStat,'magicBookMastery');
assert.deepStrictEqual(Array.from(sk.mult),[1,2,3,4,5,6,7,8,9,10]);
assert.ok(sk.desc.includes('水／風／地／火／毒'));
function setup(job,weapon,lv){
 const stateObj={
  jobId:job,baseLevel:250,jobLevel:60,stats:{str:120,agi:120,vit:120,int:120,dex:120,luk:120},
  traitAlloc:{pow:0,spl:100,con:100,sta:0,wis:100,crt:0},traitStats:{pow:0,spl:100,con:100,sta:0,wis:100,crt:0},
  equip:{head_top:null,head_mid:null,head_bottom:null,weapon:'we',armor:null,garment:null,footgear:null,accessory1:null,accessory2:null},
  instances:{we:{item:weapon,refine:20,grade:'D',cards:[]}},
  learnedSkills:{[skillId]:lv},cardSkills:{},relics:{},buffs:[],monsters:[],cooldowns:{},
  hp:100000,maxHp:100000,sp:100000,maxSp:100000,inventory:[],gold:0,jobHistory:{},jobLevelHistory:{},traitPoints:0,spirits:0
 };
 run(`state=${JSON.stringify(stateObj)};_gearBonusCache=null;_gearBonusKey='';recomputeDerived();state.matk=1000;state.sMatk=0;state.dragonMatkPct=0;`);
}
function base(element,job='element_master',weapon='boltigin',lv=10){
 setup(job,weapon,lv);
 return run(`skillBaseDamage(true,{race:'plant',size:'large',isBoss:false},1,{element:${JSON.stringify(element)}})`);
}
const elements=['water','wind','earth','fire','poison'];
for(const el of elements) assert.strictEqual(base(el),1100,`${el} Lv10 book bonus`);
assert.strictEqual(base('fire','element_master','boltigin',1),1010,'Lv1 gives +1%');
assert.strictEqual(base('fire','element_master','boltigin',5),1050,'Lv5 gives +5%');
assert.strictEqual(base('fire','element_master','thanos_bow_ad',10),1000,'no book means no mastery');
assert.strictEqual(base('holy'),1000,'holy is excluded');
assert.strictEqual(base('ghost'),1000,'ghost is excluded');
assert.strictEqual(base('neutral'),1000,'neutral is excluded');
assert.strictEqual(base('fire','arch_mage','boltigin',10),1000,'other jobs do not receive mastery');
setup('element_master','boltigin',0);const matkLv0=run('state.matk');
setup('element_master','boltigin',10);const matkLv10=run('state.matk');
assert.strictEqual(matkLv10,matkLv0,'mastery does not add flat MATK');
console.log(JSON.stringify({assertions:14,passed:true,elements,levels:[1,5,10],requiresBook:true,matkFlatBonus:0}));
