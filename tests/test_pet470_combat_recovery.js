const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
let now=500000;
const calls=[],logs=[];
const math=Object.create(Math); math.random=()=>0;
const ctx={
  console,
  Date:class extends Date { static now(){return now;} },
  Math:math,
  state:{pet:{eggId:'tamadora_egg',intimacy:950},hp:50,maxHp:100,sp:20,maxSp:100,monsters:[{hp:100}]},
  effectiveGearBonuses:()=>({}),
  getItemQty:()=>0,
  tryAutoSpells:function(trigger){calls.push(['baseAutoSpell',trigger]);},
  castSkill:function(id,opts){
    calls.push(['cast',id,opts]);
    if(id==='heal') ctx.state.hp=Math.min(ctx.state.maxHp,ctx.state.hp+10);
    return true;
  },
  skillLv:()=>0,
  applyItemRecoveryTick:e=>{
    ctx.state.hp=Math.min(ctx.state.maxHp,ctx.state.hp+(Number(e.hp)||0));
    ctx.state.sp=Math.min(ctx.state.maxSp,ctx.state.sp+(Number(e.sp)||0));
    calls.push(['recovery',e.hp,e.sp]);
  },
  tryItemRecoveryProcs:()=>true,
  saveGameThrottled:()=>calls.push(['save']),
  saveGame:()=>calls.push(['save']),
  renderInventoryTab:()=>{},
  renderTopBar:()=>{},
  renderPetPanel:()=>'<section><div class="dim">pet details</div></section>',
  logMsg:(msg,lane)=>logs.push([msg,lane]),
  gameTick:function(){calls.push(['baseTick']);}
};
vm.createContext(ctx);
for(const f of [
  'js/data.js',
  'js/v2_5_456_pet_system.js',
  'js/v2_5_457_pet_effect_completion.js',
  'js/v2_5_458_pet_trigger_skills.js',
  'js/v2_5_459_pet_proc_completion.js',
  'js/v2_5_460_tamadora_auto_heal.js',
  'js/v2_5_461_cat_nine_tail_recovery.js',
  'js/v2_5_468_pet_proc_accuracy.js',
  'js/v2_5_469_pet_battle_pipeline.js',
  'js/v2_5_470_pet_combat_recovery.js'
]) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const checks=[];
function check(name,fn){if(!fn())throw new Error('FAIL: '+name);checks.push(name);}

// Auto-combat proc and automatic/manual healing must use one shared pet cooldown.
ctx.tryAutoSpells('attack',{});
check('Tamadora attack proc remains connected to the automatic attack hook',()=>calls.some(x=>x[0]==='cast'&&x[1]==='heal'));
const healCount=()=>calls.filter(x=>x[0]==='cast'&&x[1]==='heal').length;
const firstCount=healCount();
ctx.state.hp=40;
ctx.gameTick();
check('Tamadora auto-heal does not bypass the attack-proc shared cooldown',()=>healCount()===firstCount);
ctx.tryAutoSpells('attack',{});
check('Tamadora attack proc cannot bypass the four-second shared cooldown',()=>healCount()===firstCount);
now+=4000;
ctx.tryAutoSpells('attack',{});
check('Tamadora attack proc resumes after the shared cooldown expires',()=>healCount()===firstCount+1);

// Loli Ruri only reacts to close-range basic physical hits.
ctx.state.pet={eggId:'loli_ruri_egg',intimacy:950};
const kyrieBefore=()=>calls.filter(x=>x[0]==='cast'&&x[1]==='heal').length;
const beforeLoli=kyrieBefore();
check('Loli Ruri ignores ranged basic physical hits',()=>ctx.tryPetOnPhysicalDamageTaken(50,{kind:'basic',ranged:true})===false&&kyrieBefore()===beforeLoli);
check('Loli Ruri ignores physical skill hits',()=>ctx.tryPetOnPhysicalDamageTaken(50,{kind:'skill',ranged:false})===false&&kyrieBefore()===beforeLoli);
check('Loli Ruri triggers on close-range basic physical hit',()=>ctx.tryPetOnPhysicalDamageTaken(50,{kind:'basic',ranged:false})===true&&kyrieBefore()===beforeLoli+1);

// Whisper's granted Hide skill is manually available, never injected into auto-combat slots.
ctx.state.pet={eggId:'whisper_egg',intimacy:950};
check('Whisper pet panel exposes manual Hide Lv1',()=>ctx.renderPetPanel().includes('手動施放隱匿 Lv1'));
const hideBefore=calls.filter(x=>x[0]==='cast'&&x[1]==='hiding').length;
check('Whisper manual skill uses granted Hide Lv1 through castSkill',()=>ctx.usePetGrantedManualSkill()===true&&calls.some(x=>x[0]==='cast'&&x[1]==='hiding'&&x[2].free===true&&x[2].forceLv===1));
check('Whisper Hide skill is not added to automatic combat selection',()=>!ctx.state.autoSkillConfig || (ctx.state.autoSkillConfig.skillId!=='hiding'&&ctx.state.autoSkillConfig.skillId2!=='hiding'));
check('Whisper summary marks Hide implemented, not pending',()=>{const rows=ctx.petSpecialEffectSummary('whisper_egg',950);return rows.some(x=>x.includes('隱匿 Lv1')&&x.includes('已實裝'))&&!rows.some(x=>x.includes('需逐項接入技能流程'));});

// Pet healing amount and natural HP regeneration are routed into existing engine bonus consumers.
ctx.state.pet={eggId:'angeling_egg',intimacy:950};
const healBonus=ctx.effectiveGearBonuses().healPct||0;
check('Angeling pet healing bonus is merged into live gear bonus bucket',()=>healBonus===8);
const healFn=engineSource('function healOutputMult()','\nfunction ',ctx);
vm.runInContext(healFn,ctx);
ctx.state.healBonusPct=healBonus;
ctx.state.hPlus=0;
ctx.buffMult=()=>({mult:1});
check('Pet healing bonus is consumed by the existing healing multiplier',()=>Math.abs(ctx.healOutputMult()-1.08)<1e-9);

ctx.state.pet={eggId:'rocker_egg',intimacy:950};
const hpRegenBonus=ctx.effectiveGearBonuses().hpRegenPct||0;
check('Rocker pet HP natural regeneration bonus is merged into live gear bonus bucket',()=>hpRegenBonus===8);
ctx.state.cardHpRegenPct=hpRegenBonus;
ctx.state.cardSpRegenPct=0;
ctx.state.hpRegenMult=1;ctx.state.spRegenMult=1;
ctx.state.maxHp=1000;ctx.state.maxSp=100;ctx.state.stats={vit:50,int:50};
ctx.state.monkRegen=null;ctx.state.zenSpFlatBonus=0;ctx.state.zenSpPctBonus=0;ctx.state.skillSpRegenPct=0;
vm.runInContext('const REGEN_HP_TICK_SEC=6, REGEN_SP_TICK_SEC=8, REGEN_IDLE_SCALE=3.5;'+engineSource('function regenPerSecond()','\nfunction ',ctx),ctx);
const withPet=ctx.regenPerSecond().hp;
ctx.state.cardHpRegenPct=0;
const withoutPet=ctx.regenPerSecond().hp;
check('Pet HP natural regeneration bonus increases the actual regen output',()=>withPet>withoutPet);

// Moonlight recovery includes HP and SP, and pet effects disappear when the pet is returned.
ctx.state.pet={eggId:'moonlight_egg',intimacy:950};
ctx.state.hp=100;ctx.state.sp=10;
ctx.tryItemRecoveryProcs('attack');
const moonProc=ctx.state.activeItemRecoveryProcs.at(-1);
check('Moonlight Loyal proc restores both HP and SP',()=>moonProc.hp===500&&moonProc.sp===20&&ctx.state.hp===600&&ctx.state.sp===30);
ctx.state.pet=null;
check('Returning the pet removes healing and regeneration bonuses',()=>Object.keys(ctx.effectiveGearBonuses()).length===0);

const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const version=fs.readFileSync(path.join(root,'VERSION.txt'),'utf8').trim();
check('v2.5.491 runtime module and cache version are synchronized',()=>version==='v2.5.491'&&index.includes('v2_5_470_pet_combat_recovery.js?v=2.5.491')&&sw.includes('ro-idle-runtime-v2.5.491'));
check('variable cast and skill-after-delay systems remain untouched',()=>!index.includes('v2_5_470_cast')&&!index.includes('v2_5_470_skill_after_delay'));

function engineSource(start,next,ctx){const s=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');const i=s.indexOf(start);if(i<0)throw new Error('missing '+start);const j=s.indexOf(next,i+start.length);if(j<0)throw new Error('missing end for '+start);return s.slice(i,j);}
console.log(`v2.5.491 pet combat/recovery checks passed (${checks.length}):\n- `+checks.join('\n- '));
