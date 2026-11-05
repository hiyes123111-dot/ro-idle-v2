const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'), js=path.join(root,'js');
const ctx={console,Date,Math,JSON,Object,Array,Set,Map,Number,String,RegExp,window:{addEventListener(){},location:{}},document:{addEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{classList:{add(){},remove(){}},appendChild(){}}},navigator:{},performance:{now:()=>0},localStorage:{getItem(){return null},setItem(){},removeItem(){}},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,alert(){},confirm:()=>true,prompt:()=>null,URL,Blob,FileReader:function(){},Image:function(){}};
ctx.window.window=ctx.window;vm.createContext(ctx);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_artifacts.js','engine.js']) vm.runInContext(fs.readFileSync(path.join(js,f),'utf8'),ctx,{filename:f,timeout:30000});
function check(ok,msg){if(!ok)throw Error('FAIL '+msg);console.log('PASS '+msg)}
const skills=vm.runInContext('SKILLS',ctx), jobs=vm.runInContext('JOB_TREE',ctx);
const third=['ra_arrowstorm','ra_aimedbolt','ra_fearbreeze'];
for(const id of third){const sk=skills[id];check(sk&&sk.type==='passive'&&sk.rangerPassiveProc,`${id} is a Ranger passive proc`);check(sk.spCost[0]===0&&sk.cooldown[0]===0,`${id} is free and has no active cooldown`)}
const wh=jobs.wind_hawk.skills;
check(wh.length===14,'Wind Hawk retains all 14 catalog skills');
for(const id of ['v25_wind_hawk_3','v25_wind_hawk_4','v25_wind_hawk_5','v25_wind_hawk_12','v25_wind_hawk_13']){const sk=skills[id];check(sk&&sk.type==='passive'&&sk.rangerPassiveProc,`${id} is an automatic attack passive`)}
for(const id of ['v25_wind_hawk_7','v25_wind_hawk_8','v25_wind_hawk_9','v25_wind_hawk_10']){const sk=skills[id];check(sk&&sk.type==='passive'&&sk.rangerTrapProc&&sk.trapEffect,`${id} is a passive trap with a real effect`)}
for(const id of ['trap','skidtrap','flasher','sleeptrap','freezingtrap','blastmine','claymoretrap','magnumbreak_h']){const sk=skills[id];check(sk&&sk.type==='passive'&&sk.passiveStat==='trapProc',`${id} legacy Hunter trap remains passive`)}
const lkOwn=['lk_berserk','lk_tensionrelax','lk_parrying','lk_aurablade','lk_concentration','lk_headcrush','lk_jointbeat','lk_spiralpierce'];
check(lkOwn.every(id=>jobs.lordknight.skills.some(x=>(typeof x==='string'?x:x.id)===id)),'Lord Knight includes all 8 class-specific skills');
for(const id of lkOwn){check(!!skills[id],`Lord Knight skill exists: ${id}`)}
console.log('PASS Ranger passive regression — all checks passed');
