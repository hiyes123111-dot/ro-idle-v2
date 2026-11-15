const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/'));
const end=files.indexOf('js/engine.js');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math:Object.create(Math),Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.Math.random=()=>0;ctx.window=ctx;vm.createContext(ctx);
for(const f of files.slice(0,end+1))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
function setup(slot,cardId,weaponCat='rod'){
 const armorType=slot==='shield'?'shield':slot==='armor'?'armor':slot.startsWith('head_')?'headgear':slot==='garment'?'garment':slot==='footgear'?'footgear':'accessory';
 run(`ITEMS.__audit_host={id:'__audit_host',type:${JSON.stringify(slot==='weapon'?'weapon':'armor')},armorType:${JSON.stringify(armorType)},weaponType:${JSON.stringify(weaponCat)},weaponCat:${JSON.stringify(weaponCat)},weaponLv:5,armorLevel:2,slots:4,desc:'防具等級: 2'};`);
 run(`state={equip:{${JSON.stringify(slot)}:'__audit_inst'},instances:{__audit_inst:{item:'__audit_host',refine:0,cards:${JSON.stringify(cardId?[cardId]:[])}}},stats:{str:50,agi:50,vit:50,int:50,dex:50,luk:50},baseLevel:200,jobLevel:70,jobId:'knight',learnedSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[],cooldowns:{},codex:{},dpsTrack:{}};_gearBonusCache=null;_gearBonusKey='';`);
 run('recomputeDerived()');
}
const tests=[];
// Executioner: large magic damage reduction is independent from physical size reduction.
setup('shield','executioner_card');
assert.strictEqual(run("effectiveGearBonuses().sizeMagicDmgReduce_large"),25);
assert.strictEqual(run("cardSizeMagicDmgReduceMult({size:'large'})"),0.75);
assert.strictEqual(run("cardSizeMagicDmgReduceMult({size:'medium'})"),1);
assert.strictEqual(run("effectiveGearBonuses().sizeDmgReduce_large"),25);
tests.push('executioner large magic damage -25%, physical separate');
// Lord of Death: normal-rank physical defense ignored, boss defense not ignored.
setup('weapon','lord_of_death_card');
assert.strictEqual(run('state.cardDefIgnoreNormalPct'),100);
assert.strictEqual(run("physDefIgnorePct({isBoss:false,race:'formless'})"),100);
assert.strictEqual(run("physDefIgnorePct({isBoss:true,race:'formless'})"),0);
assert.strictEqual(run('state.cardHpRegenPct'),-100);
assert.strictEqual(run('regenPerSecond().hp'),0);
tests.push('lord of death normal-rank DEF ignore and natural HP regen stop');
// Lord of Death: 666 HP drain each 10 seconds while equipped.
run('state.hp=3000;state.lordOfDeathDrainAt=Date.now()-1;passiveRegen()');
assert.strictEqual(run('state.hp'),2334);
run('state.hp=3000;passiveRegen()');
assert.strictEqual(run('state.hp'),3000);
tests.push('lord of death periodic HP-666/10s');
// Lord of Death: unequip penalty.
run("state={equip:{weapon:'__lord_inst'},instances:{__lord_inst:{item:'__audit_host',cards:['lord_of_death_card']}},inventory:[],hp:2000,sp:500};returnEquipToInventory('weapon')");
assert.strictEqual(run('state.hp'),1001);
assert.strictEqual(run('state.equip.weapon'),null);
tests.push('lord of death unequip HP-999');
// Xiao Qing: fixed LUK penalty is applied; unknown refine growth is not guessed.
setup('garment','xiao_qing_card');
assert.strictEqual(run("getCardBonus('luk')"),-5);
assert.ok(run("CARDS.xiao_qing_card.unimplemented.length")>0);
tests.push('xiao qing LUK-5 with refine growth explicitly deferred');
// Ernest: 3% physical attack buff registers and raises effective FLEE by 200 for 10s.
setup('footgear','as_ragged_golem_card_j');
assert.strictEqual(run("state.cardAttackBuffs.attack.length"),1);
run("tryAttackBuffs('attack',null)");
assert.ok(run("state.buffs.some(b=>b.type==='flee'&&b.flatBonus===200&&b.msRemaining===10000)"));
const fleeAfter=run('effectiveFleeWithBuff()');
assert.strictEqual(fleeAfter-run('state.flee'),200);
assert.strictEqual(run("CARDS.as_ragged_golem_card_j.unimplemented.length"),3);
tests.push('Ernest physical attack FLEE+200/10s; unsupported movement/skills remain listed');
console.log(JSON.stringify({passed:tests.length,tests}));
