const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const calls=[],logs=[];
let now=500000,roll=0;
const ctx={
 console,Date:class extends Date{static now(){return now;}},Math:Object.create(Math),
 state:{pet:null,hp:50,maxHp:100,sp:5,maxSp:100,activeItemRecoveryProcs:[]},
 castSkill:(id,opts)=>{calls.push(['cast',id,opts]);return true;},
 skillLv:id=>id==='kyrie'?5:0,
 applyItemRecoveryTick:e=>{const hp=Math.min(ctx.state.maxHp,ctx.state.hp+(Number(e.hp)||0));const sp=Math.min(ctx.state.maxSp,ctx.state.sp+(Number(e.sp)||0));ctx.state.hp=hp;ctx.state.sp=sp;calls.push(['tick',e.hp,e.sp]);},
 logMsg:m=>logs.push(m),
 saveGameThrottled:()=>{},renderInventoryTab:()=>{},renderTopBar:()=>{},
 petSpecialEffectSummary:()=>[]
};
ctx.Math.random=()=>roll;
vm.createContext(ctx);
for(const file of ['v2_5_459_pet_proc_completion.js','v2_5_468_pet_proc_accuracy.js'])
  vm.runInContext(fs.readFileSync(path.join(root,'js',file),'utf8'),ctx);
const checks=[];
function check(name,fn){if(!fn())throw new Error('FAIL '+name);checks.push(name);}

ctx.state.pet={eggId:'blue_moon_loli_ruri_egg',intimacy:800};
roll=.01;
check('Blue Moon Loli Ruri 2% proc casts learned higher Kyrie level',()=>ctx.tryPetOnPhysicalDamageTaken(100,{kind:'skill'})===true&&calls.some(x=>x[0]==='cast'&&x[1]==='kyrie'&&x[2].forceLv===5));
roll=.03;
const kyrieCount=calls.filter(x=>x[0]==='cast'&&x[1]==='kyrie').length;
check('Blue Moon proc does not trigger above 2%',()=>ctx.tryPetOnPhysicalDamageTaken(100)===false&&calls.filter(x=>x[0]==='cast'&&x[1]==='kyrie').length===kyrieCount);

ctx.state.pet={eggId:'loli_ruri_egg',intimacy:800};
roll=.005;
check('Loli Ruri 1% Heal Lv1 also works for physical skill damage',()=>ctx.tryPetOnPhysicalDamageTaken(100,{kind:'skill',ranged:true})===true&&calls.some(x=>x[0]==='cast'&&x[1]==='heal'&&x[2].forceLv===1));
ctx.state.pet.intimacy=950;
roll=.005;
check('Loli Ruri loyal tier uses Heal Lv2',()=>ctx.tryPetOnPhysicalDamageTaken(100,{kind:'basic'})===true&&calls.filter(x=>x[0]==='cast'&&x[1]==='heal').at(-1)[2].forceLv===2);

ctx.state.pet={eggId:'moonlight_egg',intimacy:300};
ctx.state.hp=10;ctx.state.sp=0;roll=.005;
check('Moonlight neutral 1% recovery restores 300 HP and 0 SP per tick',()=>{
 const ok=ctx.tryPetAttackRecovery('attack');const proc=ctx.state.activeItemRecoveryProcs.at(-1);
 return ok&&ctx.state.hp===100&&proc.hp===300&&proc.sp===0&&proc.remaining===4;
});
ctx.state.pet.intimacy=800;ctx.state.hp=10;ctx.state.sp=0;roll=.015;
check('Moonlight cordial 2% recovery restores 400 HP and 10 SP per tick',()=>{
 const ok=ctx.tryPetAttackRecovery('attack');const proc=ctx.state.activeItemRecoveryProcs.at(-1);
 return ok&&ctx.state.hp===100&&ctx.state.sp===10&&proc.hp===400&&proc.sp===10;
});
ctx.state.pet.intimacy=950;ctx.state.hp=10;ctx.state.sp=0;roll=.025;
check('Moonlight loyal 3% recovery restores 500 HP and 20 SP per tick',()=>{
 const ok=ctx.tryPetAttackRecovery('attack');const proc=ctx.state.activeItemRecoveryProcs.at(-1);
 return ok&&ctx.state.hp===100&&ctx.state.sp===20&&proc.hp===500&&proc.sp===20;
});
const count=ctx.state.activeItemRecoveryProcs.length;roll=.04;
check('Moonlight does not proc above 3%',()=>ctx.tryPetAttackRecovery('attack')===false&&ctx.state.activeItemRecoveryProcs.length===count);
check('Moonlight summary now reports SP recovery for cordial and loyal tiers',()=>{
 const rows=ctx.petSpecialEffectSummary('moonlight_egg',950);
 return rows.some(s=>s.includes('3%')&&s.includes('HP 500')&&s.includes('SP 20')&&s.includes('已實裝'));
});
check('Loli Ruri summary reports physical damage trigger rather than basic-only',()=>ctx.petSpecialEffectSummary('loli_ruri_egg',950).some(s=>s.includes('受到物理傷害時 1%')&&s.includes('治癒術 Lv2')));
check('Blue Moon summary reports verified 2% proc',()=>ctx.petSpecialEffectSummary('blue_moon_loli_ruri_egg',800).some(s=>s.includes('2%')&&s.includes('霸邪之陣 Lv2')));
console.log(`v2.5.470 pet proc accuracy checks passed (${checks.length}):\n- `+checks.join('\n- '));
