const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const files=[...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)].map(m=>m[1]).filter(f=>f.startsWith('js/'));
const end=files.indexOf('js/engine.js');
const ctx={console,window:{},CARD_ART_FALLBACKS:{},document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{appendChild(){},classList:{add(){},remove(){}}}},Image:function(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},requestAnimationFrame(){return 0},performance:{now(){return 0}},Math,Date,Map,Set,Array,Object,Number,String,JSON,RegExp,Float64Array};
ctx.window=ctx;vm.createContext(ctx);
for(const f of files.slice(0,end+1))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f,timeout:60000});
const run=x=>vm.runInContext(x,ctx);
const tests=[];
function setup(slot,cardId,weaponCat='rod'){
 const armorType=slot==='shield'?'shield':slot==='armor'?'armor':slot.startsWith('head_')?'headgear':slot==='garment'?'garment':slot==='footgear'?'footgear':'accessory';
 run(`ITEMS.__audit_host={id:'__audit_host',type:${JSON.stringify(slot==='weapon'?'weapon':'armor')},armorType:${JSON.stringify(armorType)},weaponType:${JSON.stringify(weaponCat)},weaponCat:${JSON.stringify(weaponCat)},weaponLv:5,armorLevel:2,slots:4,desc:'防具等級: 2'};`);
 run(`state={equip:{${JSON.stringify(slot)}:'__audit_inst'},instances:{__audit_inst:{item:'__audit_host',refine:0,cards:${JSON.stringify(cardId?[cardId]:[])}}},stats:{str:50,agi:50,vit:50,int:50,dex:50,luk:50},baseLevel:200,jobLevel:70,jobId:'knight',learnedSkills:{},traitAlloc:{},hp:10000,sp:1000,maxHp:10000,maxSp:1000,buffs:[],monsters:[],inventory:[]};_gearBonusCache=null;_gearBonusKey='';`);
}
const skillCases=[
 ['pitman_card','weapon','earthspike',5],['pitman_card','weapon','heavensdrive',5],
 ['hill_wind_card','weapon','thunderstorm',5],['hill_wind_card','weapon','jupitel',5],['hill_wind_card','weapon','lordofvermillion',5],
 ['rawrel_card','weapon','frostdiver_wiz',3],['rawrel_card','weapon','stormgust',3],
 ['ferus_card','weapon','firepillar',5],['ferus_card','weapon','meteorstorm',5],
 ['deathword_card','weapon','napalmbeat',5],['deathword_card','weapon','soulstrike',5],['deathword_card','weapon','hw_napalmvulcan',5]
];
for(const [card,slot,skill,expected] of skillCases){setup(slot,card);const got=run(`getSkillDamageBonus(SKILLS[${JSON.stringify(skill)}])`);assert.strictEqual(got,expected,`${card} ${skill}`);tests.push(`${card}:${skill}`);}
// Sword Guardian conditional: only one-/two-handed sword; not dagger.
setup('weapon','sword_guardian_card','sword');
let b=run('effectiveGearBonuses()');assert.strictEqual(b.skillDmg_bowlingbash,25);assert.strictEqual(b.critRate,5);assert.strictEqual(b.hit,5);tests.push('sword guardian sword condition');
setup('weapon','sword_guardian_card','dagger');b=run('effectiveGearBonuses()');assert.ok(!b.skillDmg_bowlingbash&&!b.critRate&&!b.hit);tests.push('sword guardian dagger exclusion');
// Archer Guardian conditional: only bow.
setup('weapon','archer_guardian_card','bow');b=run('effectiveGearBonuses()');assert.strictEqual(b.skillDmg_arrowshower,50);assert.strictEqual(b.critRate,5);assert.strictEqual(b.hit,5);tests.push('archer guardian bow condition');
setup('weapon','archer_guardian_card','sword');b=run('effectiveGearBonuses()');assert.ok(!b.skillDmg_arrowshower&&!b.critRate&&!b.hit);tests.push('archer guardian sword exclusion');
// Tanee and Iron Fist static effects.
setup('footgear','tanee_card');b=run('effectiveGearBonuses()');assert.strictEqual(b.hpPct,-40);assert.strictEqual(b.spPct,50);tests.push('tanee MHP/MSP');
setup('footgear','iron_fist_card');b=run('effectiveGearBonuses()');assert.strictEqual(b.expRace_formless,10);assert.strictEqual(b.raceDmgTaken_formless,20);tests.push('iron fist race EXP/damage taken');
// Card removal SP penalty applies on unequip/replacement via the shared return path.
for(const card of ['pitman_card','hill_wind_card','rawrel_card','ferus_card','deathword_card']){
 run(`state={equip:{weapon:'__sp_inst'},instances:{__sp_inst:{item:'__sp_weapon',refine:0,cards:[${JSON.stringify(card)}]}},inventory:[],sp:100};ITEMS.__sp_weapon={id:'__sp_weapon',name:'test',type:'weapon'};`);
 run("returnEquipToInventory('weapon')");assert.strictEqual(run('state.sp'),50,`${card} unequip SP`);assert.strictEqual(run("state.equip.weapon"),null);tests.push(`${card} unequip SP-50`);
}
// Black Snake has a dedicated runtime hook, not an empty/no-op card.
setup('weapon','side_winder_card');run('recomputeDerived()');assert.strictEqual(run('state.hasSideWinderDoubleAttack'),true);tests.push('side winder dedicated double attack runtime');
console.log(JSON.stringify({passed:tests.length,tests}));
