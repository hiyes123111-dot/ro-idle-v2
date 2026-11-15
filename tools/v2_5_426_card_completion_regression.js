const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/'));
const end=files.indexOf('js/engine.js');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math:Object.create(Math),Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.Math.random=()=>0;ctx.window=ctx;vm.createContext(ctx);
for(const f of files.slice(0,end+1))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
function setup(card,slot='accessory1',job='knight',refine=0){
 run(`ITEMS.__audit_host={id:'__audit_host',type:'armor',armorType:${JSON.stringify(slot==='armor'?'armor':'accessory')},armorLevel:2,slots:4,desc:'防具等級: 2'};`);
 const equip={};equip[slot]='__audit_inst';
 run(`state={equip:${JSON.stringify(equip)},instances:{__audit_inst:{item:'__audit_host',refine:${refine},cards:[${JSON.stringify(card)}]}},stats:{str:50,agi:50,vit:50,int:50,dex:50,luk:50},baseLevel:200,jobLevel:70,jobId:${JSON.stringify(job)},learnedSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[],cooldowns:{},codex:{},dpsTracker:{},spirits:0,spiritRefillAt:0};_gearBonusCache=null;_gearBonusKey='';`);
 run('recomputeDerived()');
}
const passed=[];
// Stapo card skill permissions are card-only and immediately available.
setup('stapo_card');
assert.equal(run("state.cardSkills.tf_pickstone"),1);assert.equal(run("state.cardSkills.tf_throwstone"),1);
const spBeforePick=run('state.sp');assert.equal(run("castSkill('tf_pickstone')"),true);assert.equal(run("getItemQty('stone')"),1);assert.equal(run('state.sp'),spBeforePick-2);passed.push('Stapo grants Pick Stone and Pick Stone adds one stone');
run("state.monsters=[{id:'m1',defId:'poring',hp:100,maxHp:100}];");
const spBeforeThrow=run('state.sp');assert.equal(run("castSkill('tf_throwstone')"),true);assert.equal(run("state.monsters[0].hp"),50);assert.equal(run("getItemQty('stone')"),0);assert.equal(run('state.sp'),spBeforeThrow-2);run("state.equip.accessory1=null;_gearBonusCache=null;_gearBonusKey='';recomputeDerived()");assert.equal(run("state.cardSkills.tf_pickstone||0"),0);passed.push('Stone Fling consumes stone, SP and deals fixed 50 damage');
// Removal Card HP +800 - 40 per armor refine.
setup('removal_card','armor','knight',0);let hp0=run("effectiveGearBonuses().hp");let regen=run("effectiveGearBonuses().hpRegenPct");
setup('removal_card','armor','knight',10);let hp10=run("effectiveGearBonuses().hp");
assert.equal(hp0,800);assert.equal(hp10,400);assert.equal(regen,10);passed.push('Removal Card HP formula +800 minus 40 per refine and HP regen +10%');
// Bloody Knight auto-cast registration.
setup('bloody_knight_card','weapon');
assert(run("state.cardAutoSpells.attack.some(e=>e.skill==='meteorstorm'&&e.lv===1&&e.chance===2)"));passed.push('Bloody Knight registers 2% Meteor Storm Lv1 on attack');
// Detale magic-hit trigger registration and actual Land Protector effect.
setup('detale_card','armor');
assert(run("state.cardAutoSpells.magic_hit.some(e=>e.skill==='sa_landprotector'&&e.lv===1&&e.chance===5)"));
run("state.monsters=[{id:'m1',defId:'poring',hp:100,maxHp:100}];tryAutoSpells('magic_hit',state.monsters[0]);");
assert(run("state.buffs.some(b=>b.eleFieldTag===1&&b.skillId==='sa_landprotector')"));passed.push('Detale registers 5% magic-hit Land Protector and applies field');
// Greatest General card proc and Acolyte increased chance.
setup('greatest_general_card','accessory1','priest');
assert.equal(run('state.spiritsMax'),5);assert.equal(run('state.cardSpiritProcs.length'),1);
run('Math.random=()=>0.005');run("tryCardSpiritProcs('attack')");assert.equal(run('state.spirits'),1);
setup('greatest_general_card','accessory1','knight');run('Math.random=()=>0.005');run("tryCardSpiritProcs('attack')");assert.equal(run('state.spirits'),0);passed.push('Greatest General grants attack proc resource; Acolyte chance is 2%');
console.log(JSON.stringify({passed:passed.length,tests:passed}));
