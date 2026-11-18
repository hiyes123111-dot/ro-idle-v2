const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),js=path.join(root,'js');
const ctx={console,Date,Math,JSON,Object,Array,Set,Map,Number,String,RegExp,window:{addEventListener(){},location:{}},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{classList:{add(){},remove(){}},appendChild(){}}},navigator:{},performance:{now:()=>0},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,alert(){},confirm:()=>true,prompt:()=>null,URL,Blob,FileReader:function(){},Image:function(){}};
ctx.window.window=ctx.window;vm.createContext(ctx);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_artifacts.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(js,f),'utf8'),ctx,{filename:f,timeout:30000});
const skills=vm.runInContext('SKILLS',ctx),jobs=vm.runInContext('JOB_TREE',ctx);let fails=0;
function check(ok,msg){if(!ok){fails++;console.error('FAIL '+msg)}else console.log('PASS '+msg)}
const dk=jobs.dragon_knight.skills.map(x=>skills[x.id]);
const byName=n=>dk.find(s=>s.name===n);
check(dk.length===13&&dk.every(Boolean),'Dragon Knight 13-skill fourth-job catalog fully registered');
const breath=skills.dk_dragonicbreath,aura=skills.dk_dragonicaura,hack=byName('橫揮斬'),storm=byName('風暴斬擊'),madness=skills.dk_madnesscrusher,pierce=skills.dk_dragonicpierce;
check(breath.maxLv===10&&breath.type==='damage_aoe'&&breath.mult[0]===6&&breath.mult[9]===17,'Dragon Breath follows current project balance, 600%–1,700%, Lv10');
check(breath.desc.includes('600%～1700%'),'Dragon Breath description matches its implemented damage values');
check(aura.maxLv===10&&aura.type==='buff_atk'&&aura.mult[0]===1.1&&aura.mult[9]===1.6&&aura.cooldown[0]===60,'Dragonic Aura is an ATK buff with 60s cooldown');
check(hack.id==='v25_dragon_knight_6'&&hack.name==='橫揮斬'&&hack.type==='damage_aoe'&&hack.mult[0]===7&&hack.mult[9]===21&&hack.desc.includes('700%～2,100%'),'Hack and Slasher uses canonical ID and correct Taiwan name; AOE 700%–2,100%');
check(storm.id==='v25_dragon_knight_7'&&storm.name==='風暴斬擊'&&storm.type==='damage'&&storm.rangeType==='melee'&&storm.mult[0]===19&&storm.mult[4]===21,'Storm Slash uses canonical ID, correct Taiwan name and single-target melee type; 1,900%–2,100%');
check(madness.mult[0]===9&&madness.mult[4]===19,'Madness Crusher uses the current project balance values');
check(pierce.mult[0]===7&&pierce.mult[4]===13,'Dragonic Pierce follows current project balance values');
if(fails){console.error(`FAILED ${fails} check(s)`);process.exit(1)}console.log('ALL PASSED — Dragon Knight skill regression');
