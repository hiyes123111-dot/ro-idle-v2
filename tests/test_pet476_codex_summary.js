const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={console,Date,Math,state:{pet:null},ITEMS:{},effectiveGearBonuses:()=>({})};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';globalThis.ITEMS=ITEMS;',ctx);
for(const f of [
 'js/v2_5_456_pet_system.js','js/v2_5_457_pet_effect_completion.js','js/v2_5_458_pet_trigger_skills.js',
 'js/v2_5_459_pet_proc_completion.js','js/v2_5_460_tamadora_auto_heal.js','js/v2_5_461_cat_nine_tail_recovery.js',
 'js/v2_5_468_pet_proc_accuracy.js','js/v2_5_469_pet_battle_pipeline.js','js/v2_5_470_pet_combat_recovery.js',
 'js/v2_5_471_phreeoni_pet_proc_tier.js','js/v2_5_472_pet_combat_proc_completion.js','js/v2_5_473_pet_offline_care.js',
 'js/v2_5_476_pet_codex_summary_fix.js'
]) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const checks=[];
function check(name,fn){if(!fn())throw new Error('FAIL: '+name);checks.push(name);}
function rows(level){return ctx.petSpecialEffectSummary('loli_ruri_egg',level);}
for(const level of [0,100,500,749]){
 const r=rows(level);
 check(`Loli Ruri intimacy ${level} shows one locked unlock condition, not a generic pending skill`,()=>
  r.length===1&&r[0].includes('近距離普通物理攻擊')&&r[0].includes('尚未開放')&&!r.some(x=>x.includes('需逐項接入')));
}
for(const [level,skillLv] of [[750,1],[909,1],[910,2],[950,2]]){
 const r=rows(level);
 check(`Loli Ruri intimacy ${level} shows exactly one implemented Lv${skillLv} trigger`,()=>
  r.length===1&&r[0].includes('近距離普通物理攻擊命中時 1%')&&r[0].includes(`治癒術 Lv${skillLv}`)&&r[0].includes('已實裝')&&!r[0].includes('尚未開放'));
}
check('Summary module is registered after the previous pet modules',()=>{
 const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
 return index.indexOf('v2_5_473_pet_offline_care.js')<index.indexOf('v2_5_476_pet_codex_summary_fix.js');
});
console.log(`v2.5.486 pet codex summary checks passed (${checks.length}):\n- `+checks.join('\n- '));
