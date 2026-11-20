// v2.5.324 EP21 card official-link and Wind Hawk Wild Walk regression
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const c={console,Math,Date,Set,Map,Array,Object,String,Number,JSON,window:{getItemDisplayName:()=>''}};
c.window=c; vm.createContext(c);
for(const f of ['js/skills.js','js/monster_skills.js','js/jobs.js','js/data.js','js/relics.js','js/v2_content.js','js/v2_4_content.js','js/v2_5_content.js'])
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{timeout:30000});
vm.runInContext('globalThis.out={SKILLS,JOB_TREE,ITEMS,CARDS}',c);
const {SKILLS,JOB_TREE,ITEMS,CARDS}=c.out;
const wild=SKILLS.wh_wild_walk;
assert(wild,'Wild Walk skill is registered');
assert.equal(wild.name,'狂野疾行');
assert.equal(wild.type,'damage_multi');
assert.equal(wild.element,'weapon');
assert.deepEqual(Array.from(wild.mult),[7,10.5,14,17.5,21]);
assert.deepEqual(Array.from(wild.hits),[3,3,3,3,3]);
assert.deepEqual(Array.from(wild.fleeFlat),[100,150,200,250,300]);
assert.deepEqual(Array.from(wild.duration),[6,9,12,15,18]);
assert.equal(wild.critRateMult,1); assert.equal(wild.critDmgMult,0.5);
assert.deepEqual(Array.from(wild.spCost),[63,66,69,72,75],'twRO SP cost retained; AP is not converted to SP');
assert(wild.requires.some(x=>x.skillId==='v25_wind_hawk_1'&&x.level===3),'Nature Friendly prerequisite');
assert(wild.requires.some(x=>x.skillId==='v25_wind_hawk_13'&&x.level===3),'Hawk Rush prerequisite');
assert((JOB_TREE.wind_hawk.skills||[]).some(x=>x.id==='wh_wild_walk'),'Wild Walk appears in Wind Hawk tree');

const ylze=CARDS.ep21_ylze_card;
const ylzeKeys=Object.keys(ylze.perRefine||{}).filter(k=>k.startsWith('skillDmg_'));
assert.deepEqual(ylzeKeys.sort(),['skillDmg_v25_element_master_6','skillDmg_v25_element_master_8'].sort(),'Ilze only buffs Lightning Land and Earth Drive');
assert(!JSON.stringify(ylze.condBonus).includes('v25_element_master_5'),'Ilze no longer buffs Lava Flow');
assert(!ylze.desc.includes('灼熱岩漿'),'Ilze card description matches official two-skill list');
const epesto=CARDS.ep21_epesto_card;
const epestoKeys=Object.keys(epesto.perRefine||{}).filter(k=>k.startsWith('skillDmg_'));
assert(epestoKeys.includes('skillDmg_v25_windhawk_progressive_shot'));
assert(epestoKeys.includes('skillDmg_sn_sharpshooting'));
assert(!epestoKeys.includes('skillDmg_wh_wild_walk'),'Epesto must not buff Wild Walk');
assert(epesto.desc.includes('銳利射擊'),'Epesto card description includes Sharpshooting');
assert(!epesto.desc.includes('狂野疾行'),'Epesto card description no longer names Wild Walk');
assert((epesto.condBonus||[]).some(r=>r.bonus&&r.bonus.perItem1Refine_skillDmg_sn_sharpshooting===12),'circlet refine bonus linked to Wild Walk');

const data=fs.readFileSync(path.join(root,'js/data.js'),'utf8');
const fragments=[...data.matchAll(/'ep21_[a-z0-9_]+_card_fragment'\s*:/g)];
assert.equal(fragments.length,18,'all 18 card fragments remain defined');
const engine=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
assert(engine.includes("sk.element === 'weapon'"),'weapon/ammo element resolution exists');
assert(engine.includes("skillLv('falconnastery')"),'Wild Walk uses Steel Beak level');
assert(engine.includes('(baseMult + extraPct) * (Math.max(1, Number(state.baseLevel) || 1) / 100)'),'Wild Walk applies BaseLv to the complete official formula');
assert(engine.includes("skillLv('v25_wind_hawk_1')"),'Wild Walk uses Nature Friendly level');
assert(engine.includes('applyWildWalkFlee()'),'Wild Walk FLEE buff applies on hit and miss');
assert(engine.includes('perHitMult * critFactor'),'multi-hit skill crit is applied to every hit');
console.log('v2.5.324 EP21/Wild Walk: PASS (official card links, Wind Hawk skill, 3 hits, v2.5.480 multiplier, scaling, crit, weapon element and FLEE buff)');
