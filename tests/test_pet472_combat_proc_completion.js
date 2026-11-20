const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
let randomValue=0.5;
const math=Object.create(Math);math.random=()=>randomValue;
const ctx={
 console,Date,Math:math,ITEMS:{},
 state:{pet:{eggId:'incubus_egg',intimacy:750},hp:500,maxHp:1000,sp:20,maxSp:1000,activeItemRecoveryProcs:[]},
 logMsg:()=>{}, effectiveGearBonuses:()=>({})
};
ctx.applyItemRecoveryTick=(e)=>{
 ctx.state.hp=Math.min(ctx.state.maxHp,ctx.state.hp+(Number(e.hp)||0));
 ctx.state.sp=Math.min(ctx.state.maxSp,ctx.state.sp+(Number(e.sp)||0));
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/data.js'),'utf8')+';globalThis.ITEMS=ITEMS;',ctx);
for(const f of [
 'js/v2_5_456_pet_system.js','js/v2_5_457_pet_effect_completion.js','js/v2_5_458_pet_trigger_skills.js',
 'js/v2_5_459_pet_proc_completion.js','js/v2_5_460_tamadora_auto_heal.js','js/v2_5_461_cat_nine_tail_recovery.js',
 'js/v2_5_468_pet_proc_accuracy.js','js/v2_5_469_pet_battle_pipeline.js','js/v2_5_470_pet_combat_recovery.js',
 'js/v2_5_471_phreeoni_pet_proc_tier.js','js/v2_5_472_pet_combat_proc_completion.js'
]) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const checks=[];
function check(n,fn){if(!fn())throw new Error('FAIL: '+n);checks.push(n);}
check('Incubus cordial parser fixes MSP +3% and 2% SP drain',()=>ctx.petParsedBonus('incubus_egg',750).spPct===3&&ctx.petTierText('incubus_egg',750).includes('2%'));
check('Incubus loyal parser fixes MSP +5% and 3% SP drain',()=>ctx.petParsedBonus('incubus_egg',950).spPct===5&&ctx.petTierText('incubus_egg',950).includes('3%'));
check('Incubus baseline SP drain remains active at all intimacy levels',()=>ctx.petTierText('incubus_egg',100).includes('2%'));
check('Pet intimacy label uses the same 910 loyal threshold as pet effects',()=>ctx.petIntimacyLabel(909)==='有點親密'&&ctx.petIntimacyLabel(910)==='非常親密');
check('High-intimacy pet bonuses do not activate at 909 and activate at 910',()=>ctx.petParsedBonus('clb_ss_egg01',909).critRate===7&&ctx.petParsedBonus('clb_ss_egg01',909).meleeDmgPct===2&&ctx.petParsedBonus('clb_ss_egg01',910).critRate===9&&ctx.petParsedBonus('clb_ss_egg01',910).meleeDmgPct===3);
check('Live pet bonus map exposes Incubus MSP and Succubus MHP percentage bonuses',()=>{ctx.state.pet={eggId:'incubus_egg',intimacy:950};const a=ctx.getPetBonus('spPct')===5;ctx.state.pet={eggId:'succubus_egg',intimacy:950};return a&&ctx.getPetBonus('hpPct')===1;});
check('Incubus physical hit converts 1% damage to SP at cordial chance',()=>{ctx.state.pet={eggId:'incubus_egg',intimacy:750};ctx.state.sp=20;randomValue=.019;const ok=ctx.tryPetOutgoingDamageProc(1000,'physical');return ok&&ctx.state.sp===30;});
check('Incubus proc is not activated by magic damage',()=>{ctx.state.pet={eggId:'incubus_egg',intimacy:950};ctx.state.sp=20;randomValue=.001;return ctx.tryPetOutgoingDamageProc(1000,'magic')===false&&ctx.state.sp===20;});
check('Succubus is inactive before cordial intimacy',()=>{ctx.state.pet={eggId:'succubus_egg',intimacy:500};ctx.state.hp=500;randomValue=.001;return ctx.tryPetOutgoingDamageProc(1000,'physical')===false&&ctx.state.hp===500;});
check('Succubus cordial physical hit converts 5% damage to HP',()=>{ctx.state.pet={eggId:'succubus_egg',intimacy:750};ctx.state.hp=500;randomValue=.019;const ok=ctx.tryPetOutgoingDamageProc(1000,'physical');return ok&&ctx.state.hp===550;});
check('Succubus loyal tier includes MHP +1%',()=>ctx.petParsedBonus('succubus_egg',950).hpPct===1);
check('Teddy Bear cordial magic hit queues five seconds of 30 SP ticks',()=>{ctx.state.pet={eggId:'xm_teddybear_egg',intimacy:750};ctx.state.sp=20;ctx.state.activeItemRecoveryProcs=[];randomValue=.005;const ok=ctx.tryPetOutgoingDamageProc(500,'magic');return ok&&ctx.state.sp===50&&ctx.state.activeItemRecoveryProcs[0].remaining===4&&ctx.state.activeItemRecoveryProcs[0].sp===30;});
check('Teddy Bear loyal tier uses 40 SP per tick',()=>{ctx.state.pet={eggId:'xm_teddybear_egg',intimacy:950};ctx.state.sp=20;ctx.state.activeItemRecoveryProcs=[];randomValue=.005;const ok=ctx.tryPetOutgoingDamageProc(500,'magic');return ok&&ctx.state.sp===60&&ctx.state.activeItemRecoveryProcs[0].sp===40;});
check('Teddy Bear does not proc on physical damage',()=>{ctx.state.pet={eggId:'xm_teddybear_egg',intimacy:950};ctx.state.sp=20;randomValue=.001;return ctx.tryPetOutgoingDamageProc(500,'physical')===false&&ctx.state.sp===20;});
check('Marionette physical hit triggers three-second neutral resistance and HP recovery',()=>{ctx.state.pet={eggId:'marionette_egg',intimacy:100};ctx.state.hp=500;ctx.state.activeItemRecoveryProcs=[];randomValue=.005;const ok=ctx.tryPetMarionetteProc(100,{kind:'basic',element:'none'});return ok&&ctx.state.hp===600&&ctx.petMarionetteNeutralActive()&&ctx.state.activeItemRecoveryProcs[0].remaining===2;});
check('Marionette neutral buff expires by timestamp',()=>{ctx.state.petMarionetteNeutralUntil=Date.now()-1;return !ctx.petMarionetteNeutralActive();});
check('Pet switch removes outgoing proc and pet-specific live effects',()=>{ctx.state.pet={eggId:'poring_egg',intimacy:950};ctx.state.sp=20;randomValue=.001;return ctx.tryPetOutgoingDamageProc(1000,'physical')===false&&!ctx.petMarionetteNeutralActive();});
check('TWRO Fei-Chai pet tiers now parse CRI and melee damage correctly',()=>ctx.petParsedBonus('clb_ss_egg01',100).critRate===3&&ctx.petParsedBonus('clb_ss_egg01',500).critRate===5&&ctx.petParsedBonus('clb_ss_egg01',500).meleeDmgPct===1&&ctx.petParsedBonus('clb_ss_egg01',950).critRate===9&&ctx.petParsedBonus('clb_ss_egg01',950).meleeDmgPct===3);
check('Tai-Zi and Ancient Icewind eggs no longer import unrelated foreign-server pet stats',()=>Object.keys(ctx.petParsedBonus('clb_ss_egg02',950)).length===0&&Object.keys(ctx.petParsedBonus('ep20_ice_egg',950)).length===0);
check('Localized parsed pet bonuses no longer show redundant foreign-language warnings',()=>!ctx.petSpecialEffectSummary('clb_ss_egg01',950).some(x=>x.includes('外文寵物效果'))&&!ctx.petSpecialEffectSummary('orc_hero_egg',950).some(x=>x.includes('外文寵物效果')));
check('Inactive low-intimacy inducement/recovery effects are not mislabeled as unresolved',()=>!ctx.petSpecialEffectSummary('phreeoni_egg',100).some(x=>x.includes('需確認本作'))&&!ctx.petSpecialEffectSummary('moonlight_egg',100).some(x=>x.includes('未有明確機率'))&&!ctx.petSpecialEffectSummary('e_duckling_egg',500).some(x=>x.includes('需確認本作')));
check('Duckling inducement chance is parsed at cordial and loyal intimacy',()=>ctx.petParsedBonus('e_duckling_egg',750).perfectHitAddRate===5&&ctx.petParsedBonus('e_duckling_egg',950).perfectHitAddRate===10);
check('Pet panel/codex shows all four proc effects as implemented',()=>{
 const a=ctx.petSpecialEffectSummary('marionette_egg',950).join(' ');
 const b=ctx.petSpecialEffectSummary('incubus_egg',950).join(' ');
 const c=ctx.petSpecialEffectSummary('succubus_egg',950).join(' ');
 const d=ctx.petSpecialEffectSummary('xm_teddybear_egg',950).join(' ');
 return a.includes('已實裝')&&b.includes('已實裝')&&c.includes('已實裝')&&d.includes('已實裝');
});
const eggIds=ctx.petEggIds();
check('All 133 pet eggs resolve to existing item records without duplicate IDs',()=>eggIds.length===133&&new Set(eggIds).size===133&&eggIds.every(id=>!!ctx.ITEMS[id]));
check('Pet codex summaries render across all 133 eggs and four intimacy tiers',()=>eggIds.every(id=>[100,500,750,950].every(level=>Array.isArray(ctx.petSpecialEffectSummary(id,level)))));
const engine=fs.readFileSync(path.join(root,'js/engine.js'),'utf8');
check('Engine calls outgoing pet procs on basic, single skill, and AoE hit paths',()=>engine.includes("tryPetOutgoingDamageProc(dmg, 'physical')")&&engine.includes("tryPetOutgoingDamageProc(dmg, useMag ? 'magic' : 'physical')")&&engine.includes("tryPetOutgoingDamageProc(dmg, useMag ? 'magic' : 'physical');"));
check('Engine applies Marionette neutral resistance to physical incoming damage',()=>engine.includes("petMarionetteNeutralActive()) dmg = Math.max(1,Math.round(dmg*0.8))")&&engine.includes("tryPetMarionetteProc(dmg, { kind:'basic', element:monAtkElement })"));
console.log(`v2.5.486 pet proc checks passed (${checks.length}):\n- `+checks.join('\n- '));
