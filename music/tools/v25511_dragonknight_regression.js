const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),js=path.join(root,'js');
const ctx={console,Date,Math,JSON,Object,Array,Set,Map,Number,String,RegExp,window:{addEventListener(){},location:{}},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{classList:{add(){},remove(){}},appendChild(){}}},navigator:{},performance:{now:()=>0},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,alert(){},confirm:()=>true,prompt:()=>null,URL,Blob,FileReader:function(){},Image:function(){}};
ctx.window.window=ctx.window;vm.createContext(ctx);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_artifacts.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(js,f),'utf8'),ctx,{filename:f,timeout:30000});
const skills=vm.runInContext('SKILLS',ctx),jobs=vm.runInContext('JOB_TREE',ctx);let fails=0;
function check(ok,msg){if(!ok){fails++;console.error('FAIL '+msg)}else console.log('PASS '+msg)}
const dk=jobs.dragon_knight.skills.map(x=>skills[x.id]);
const byName=n=>dk.find(s=>s.name===n);
check(dk.length===13&&dk.every(Boolean),'Dragon Knight 13-skill fourth-job catalog fully registered');
const breath=byName('天龍氣息'),aura=byName('天龍光環'),hack=byName('橫揮斬'),storm=byName('風暴斬擊'),madness=byName('狂暴粉碎'),pierce=byName('神龍貫刺');
check(breath.maxLv===10&&breath.type==='damage_aoe'&&breath.mult[0]===4&&breath.mult[9]===35.5,'Dragon Breath is physical AOE, 400%–3,550%, Lv10');
check(breath.requiresSkill==='rk_dragontraining'&&breath.desc.includes('MaxHP／MaxSP 額外係數'),'Dragon Breath requires Dragon Training and discloses unimplemented HP/SP factor');
check(aura.maxLv===10&&aura.type==='damage'&&aura.mult[0]===129&&aura.mult[9]===390&&aura.cooldown[0]===60,'Dragonic Aura is active 12,900%–39,000%, 60s cooldown');
check(hack.type==='damage_aoe'&&hack.mult[0]===27&&hack.mult[9]===54&&hack.desc.includes('2,700%～5,400%'),'Hack and Slash is AOE 2,700%–5,400%');
check(storm.type==='damage_aoe'&&storm.mult[0]===19&&storm.mult[4]===21,'Storm Slash is AOE 1,900%–2,100%');
check(madness.mult[0]===71&&madness.mult[4]===201,'Madness Crusher is 7,100%–20,100%');
check(pierce.requiresWeapon==='spear'&&pierce.mult[0]===76&&pierce.mult[4]===162,'Dragonic Pierce is spear-gated 7,600%–16,200%');
if(fails){console.error(`FAILED ${fails} check(s)`);process.exit(1)}console.log('ALL PASSED — Dragon Knight skill regression');
