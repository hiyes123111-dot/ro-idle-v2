const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const storage=Object.create(null);
const math=Object.create(Math); math.random=()=>0;
const c={console,Math:math,Date,JSON,Object,Array,Set,Map,Number,String,RegExp,
  window:{addEventListener(){},location:{}},
  document:{addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return {innerHTML:'',firstElementChild:null}},body:{classList:{add(){},remove(){}},appendChild(){}}},
  navigator:{},performance:{now:()=>0},alert(){},confirm:()=>true,prompt:()=>null,URL,Blob,FileReader:function(){},Image:function(){},requestAnimationFrame:()=>0,
  setTimeout(){return 0},clearTimeout(){},setInterval(){return 0},clearInterval(){},localStorage:{getItem(k){return storage[k]??null},setItem(k,v){storage[k]=String(v)},removeItem(k){delete storage[k]}}};
c.window.window=c.window;c.window.document=c.document;vm.createContext(c);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','engine.js']) vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),c,{filename:f,timeout:30000});
const run=x=>vm.runInContext(x,c);
run(`state={name:'audit',jobId:'wind_hawk',baseLevel:250,jobLevel:1,stats:{str:100,agi:100,vit:100,int:100,dex:100,luk:100},traitAlloc:{pow:0,sta:0,wis:0,spl:0,con:0,crt:0},learnedSkills:{v25_wind_hawk_7:5},rangerProcStats:{},trapReadyAt:{},trapChanceBonusPct:0,trapCdReductionSec:0,monsters:[],inventory:[],instances:{},equip:{weapon:'audit_bow'},buffs:[],relics:{}};`);
run(`ITEMS.audit_bow={id:'audit_bow',name:'Audit Bow',type:'weapon',weaponType:'bow'};`);
const monId=run(`Object.keys(MONSTERS)[0]`);
run(`const __md=MONSTERS[${JSON.stringify(monId)}]; globalThis.__target={id:1,defId:${JSON.stringify(monId)},hp:999999,maxHp:999999}; globalThis.__monDef=__md; state.monsters=[__target];`);
run(`tryTrapProcs(__target,__monDef);`);
let st=run(`rangerProcStatsSnapshot().v25_wind_hawk_7`);
assert.strictEqual(st.eligible,1);assert.strictEqual(st.rolls,1);assert.strictEqual(st.procs,1);assert.strictEqual(st.cooldownSkips,0);
assert(Object.keys(storage).length>0,'trigger counters are persisted through existing save system');
// The same trap is now on cooldown: count a skip, not a failed chance roll.
run(`tryTrapProcs(__target,__monDef);`);
st=run(`rangerProcStatsSnapshot().v25_wind_hawk_7`);
assert.strictEqual(st.eligible,2);assert.strictEqual(st.rolls,1);assert.strictEqual(st.procs,1);assert.strictEqual(st.cooldownSkips,1);
// A failed probability roll increments rolls but not procs.
run(`state.trapReadyAt.v25_wind_hawk_7=0;`);math.random=()=>0.999;
run(`tryTrapProcs(__target,__monDef);`);
st=run(`rangerProcStatsSnapshot().v25_wind_hawk_7`);
assert.strictEqual(st.eligible,3);assert.strictEqual(st.rolls,2);assert.strictEqual(st.procs,1);
// Reset clears only the statistics and persists through saveGame.
assert.strictEqual(run(`resetRangerProcStats()`),true);
assert.deepStrictEqual(JSON.parse(JSON.stringify(run(`rangerProcStatsSnapshot()`))),{});
assert(Object.keys(storage).length>0,'reset is persisted');
console.log('v2.5.429 Ranger trap stats: PASS (eligible, rolls, procs, cooldown skips, measured probability, reset)');
