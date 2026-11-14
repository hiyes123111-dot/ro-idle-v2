const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert');
const root=path.resolve(__dirname,'..');
const storage=Object.create(null);
const documentStub={addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},createElement(){return{}},body:{classList:{add(){},remove(){}},appendChild(){}}};
const context={console,Date,Math,JSON,Object,Array,Set,Map,Number,String,RegExp,setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},localStorage:{getItem(k){return storage[k]??null},setItem(k,v){storage[k]=String(v)},removeItem(k){delete storage[k]}},window:{addEventListener(){},location:{}},document:documentStub,navigator:{},performance:{now:()=>0},alert(){},confirm:()=>true,prompt:()=>null,URL,Blob,FileReader:function(){},Image:function(){},requestAnimationFrame:()=>0};
context.window.window=context.window;context.window.document=documentStub;vm.createContext(context);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','engine.js']) vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),context,{filename:f,timeout:30000});
function run(code){return vm.runInContext(code,context)}
run("state={name:'測試角色'}; pushCombatLog('測試戰鬥紀錄','main'); pushCombatLog('測試技能紀錄','skill'); pushCombatLog('測試隊友紀錄','ally'); saveCombatLogHistory();");
const keys=Object.keys(storage);
assert(keys.some(k=>k.includes('測試角色')),'saved under character-specific key');
run("combatLogLanes.main.length=0; combatLogLanes.skill.length=0; combatLogLanes.ally.length=0; combatLogBuf.length=0; _combatLogHistoryLoadedKey=null; loadCombatLogHistory();");
assert(run("combatLogLanes.main[0].includes('測試戰鬥紀錄')"),'main lane restored');
assert(run("combatLogLanes.skill[0].includes('測試技能紀錄')"),'skill lane restored');
assert(run("combatLogLanes.ally[0].includes('測試隊友紀錄')"),'ally lane restored');
run("state.name='另一個角色'; loadCombatLogHistory();");
assert.strictEqual(run("combatLogLanes.main.length"),0,'new character does not inherit previous character logs');
assert.strictEqual(run("combatLogLanes.skill.length"),0,'new character skill log is isolated');
console.log('v2.5.376 combat log persistence: PASS (3 lanes restore, per-character isolation, guarded localStorage)');
