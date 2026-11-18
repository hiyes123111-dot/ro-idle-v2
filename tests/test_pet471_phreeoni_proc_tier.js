const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const math=Object.create(Math); math.random=()=>0.09;
const ctx={console,Date,Math:math,state:{pet:{eggId:'phreeoni_egg',intimacy:750}},ITEMS:{},effectiveGearBonuses:()=>({})};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';globalThis.ITEMS=ITEMS;',ctx);
for(const f of ['js/v2_5_456_pet_system.js','js/v2_5_457_pet_effect_completion.js','js/v2_5_458_pet_trigger_skills.js','js/v2_5_459_pet_proc_completion.js','js/v2_5_460_tamadora_auto_heal.js','js/v2_5_461_cat_nine_tail_recovery.js','js/v2_5_468_pet_proc_accuracy.js','js/v2_5_469_pet_battle_pipeline.js','js/v2_5_470_pet_combat_recovery.js','js/v2_5_471_phreeoni_pet_proc_tier.js']){
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
}
const checks=[];
function check(name,fn){if(!fn())throw new Error('FAIL: '+name);checks.push(name);}
const n=ctx.petParsedBonus('phreeoni_egg',500);
const c=ctx.petParsedBonus('phreeoni_egg',750);
const l=ctx.petParsedBonus('phreeoni_egg',950);
check('Phreeoni neutral tier includes official 5% perfect-hit proc',()=>n.hit===10&&n.perfectHitAddRate===5);
check('Phreeoni cordial tier includes missing official 10% perfect-hit proc',()=>c.hit===14&&c.perfectHitAddRate===10);
check('Phreeoni loyal tier retains official 15% perfect-hit proc',()=>l.hit===18&&l.perfectHitAddRate===15);
check('Phreeoni cordial tier does not stack lower neutral tier',()=>c.perfectHitAddRate===10);
check('Phreeoni codex summary reports cordial 10% as implemented',()=>ctx.petSpecialEffectSummary('phreeoni_egg',750).some(x=>x.includes('必中機率 +10%')&&x.includes('已接入')));
check('Phreeoni bonus is merged into the shared live gear bonus pipeline',()=>ctx.effectiveGearBonuses().perfectHitAddRate===10);
check('Duckling cordial and loyal inducement rates remain 5% and 10%',()=>ctx.petParsedBonus('e_duckling_egg',750).perfectHitAddRate===5&&ctx.petParsedBonus('e_duckling_egg',950).perfectHitAddRate===10);

// Run the real physical-skill hit helper with the active pet bonus as its source.
ctx.getCardBonus=k=>Number(ctx.effectiveGearBonuses()[k]||0);
ctx.effectiveHitWithBuff=()=>0;
ctx.buffMult=()=>({flatBonus:0});
ctx.playerAilPct=()=>0;
ctx.hitChancePctVsMonster=()=>0;
const engine=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
const start=engine.indexOf('function skillHits(');
const end=engine.indexOf('\nfunction ',start+20);
if(start<0||end<0)throw new Error('skillHits helper not found');
vm.runInContext(engine.slice(start,end),ctx);
math.random=()=>0.099;
check('Cordial Phreeoni 10% actually forces a physical skill hit inside its chance',()=>ctx.skillHits({id:'test_skill'},1,0,{})===true);
math.random=()=>0.101;
check('Cordial Phreeoni does not force physical skill hits outside its 10% chance',()=>ctx.skillHits({id:'test_skill'},1,0,{})===false);
check('Basic physical attack path also reads the shared perfect-hit bonus',()=>engine.includes("const perfectHitPct = Math.max(0, Math.min(100, getCardBonus('perfectHitAddRate') || 0));")&&engine.includes('const forcedHit = perfectHitPct > 0 && Math.random() * 100 < perfectHitPct;'));
ctx.state.pet={eggId:'poring_egg',intimacy:950};
check('Switching away from Phreeoni immediately removes its perfect-hit proc',()=>ctx.effectiveGearBonuses().perfectHitAddRate===undefined||ctx.effectiveGearBonuses().perfectHitAddRate===0);
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
check('Runtime script and all cache/version markers use v2.5.481',()=>fs.readFileSync(path.join(root,'VERSION.txt'),'utf8').trim()==='v2.5.481'&&index.includes('v2_5_471_phreeoni_pet_proc_tier.js?v=2.5.481')&&sw.includes('ro-idle-runtime-v2.5.481'));
console.log(`v2.5.481 Phreeoni tier checks passed (${checks.length}):\n- `+checks.join('\n- '));
