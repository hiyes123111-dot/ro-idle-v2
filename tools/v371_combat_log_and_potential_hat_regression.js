const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const storage=Object.create(null);
const documentStub={addEventListener(){},removeEventListener(){},getElementById(){return null},querySelector(){return null},querySelectorAll(){return []},createElement(){return{}},body:{classList:{add(){},remove(){}},appendChild(){}}};
const context={console,Date,Math,JSON,Object,Array,Set,Map,Number,String,RegExp,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},localStorage:{getItem(k){return storage[k]??null},setItem(k,v){storage[k]=String(v)},removeItem(k){delete storage[k]}},window:{addEventListener(){},location:{}},document:documentStub,navigator:{},performance:{now:()=>0},alert(){},confirm:()=>true,prompt:()=>null,URL,Blob,FileReader:function(){},Image:function(){},requestAnimationFrame:()=>0};
context.window.window=context.window;context.window.document=documentStub;vm.createContext(context);
for(const f of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js','v2_6_skill_migration.js','v2_7_headgear_migration.js','v2_8_headgear_round16.js','v2_9_headgear_round17.js','item_display_name_fix.js','v2_artifacts.js','achievements.js','engine.js']) vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),context,{filename:f,timeout:30000});
const checks=vm.runInContext(`(()=>{
 const out=[];
 const hat='2023seppay_06';
 state={equip:{head_top:'hatinst'},instances:{hatinst:{item:hat,refine:11,cards:[]}},learnedSkills:{},cardSkills:{},buffs:[],cardSpCostPct:0,skillSpCostPct:0};
 let g=cardGrantedSkills(); out.push(['+11 不賦予帽子技能',!g.maximize&&!g.recognizedspell]);
 state.instances.hatinst.refine=12; g=cardGrantedSkills();
 out.push(['+12 賦予武器值最大化 Lv5',g.maximize===5]);
 out.push(['+12 賦予魔法省悟 Lv3',g.recognizedspell===3]);
 state.buffs=[{type:'recognizedspell',msRemaining:120000}];
 const c=skillSpCost({spCost:[100]},1);
 out.push(['魔法省悟期間 SP 消耗 +25%',c===125]);
 state.buffs=[]; out.push(['魔法省悟結束後 SP 消耗恢復',skillSpCost({spCost:[100]},1)===100]);
 state.equip.head_top=null; g=cardGrantedSkills();
 out.push(['卸下帽子撤銷裝備技能',!g.maximize&&!g.recognizedspell]);
 return out;
})()`,context);
let fail=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++;}

const ui=fs.readFileSync(path.join(root,'js/ui.js'),'utf8');
const engine=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const logChecks=[
 ['三分類日誌各保留最近 1000 筆',engine.includes('buf.length > 1000')],
 ['單筆紀錄可點擊開啟詳細視窗',ui.includes('openCombatLogDetail') && ui.includes('onclick=')],
 ['三分類均有完整歷史入口',index.includes("openCombatLogHistory('main')") && index.includes("openCombatLogHistory('skill')") && index.includes("openCombatLogHistory('ally')")],
 ['紀錄詳細視窗已加入頁面',index.includes('combat-log-detail-modal')]
];
for(const [name,ok] of logChecks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++;}
const hatDef=vm.runInContext("ITEMS['2023seppay_06']",context);
const hatChecks=[
 ['LT 帽技能賦予有精煉 +12 門檻',hatDef.grantSkillWhen && hatDef.grantSkillWhen[0].when.refineMin===12],
 ['不再把技能後延遲誤當冷卻縮短',!(hatDef.condBonus||[]).some(r=>r.bonus && Object.prototype.hasOwnProperty.call(r.bonus,'skillCdFlat'))]
];
for(const [name,ok] of hatChecks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++;}
const skills=vm.runInContext(`SKILLS.recognizedspell && [SKILLS.recognizedspell.duration[2],SKILLS.recognizedspell.cooldown[2],SKILLS.recognizedspell.spCost[2]]`,context);
console.log(`魔法省悟 Lv3 數值：持續${skills[0]}秒／冷卻${skills[1]}秒／施放SP${skills[2]}`);
console.log(`${checks.length+logChecks.length+hatChecks.length-fail}/${checks.length+logChecks.length+hatChecks.length} passed`); if(fail)process.exitCode=1;
