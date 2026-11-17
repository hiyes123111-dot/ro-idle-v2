const fs = require('fs');
const vm = require('vm');
let now = 200000;
const calls = [];
const logs = [];
const ctx = {
  console,
  Date: class extends Date { static now() { return now; } },
  Math: Object.create(Math),
  state: {
    pet:{eggId:'cat_o_nine_tail_egg',intimacy:800},
    hp:100,maxHp:1000,sp:0,maxSp:100
  },
  applyItemRecoveryTick: e => {
    ctx.state.hp = Math.min(ctx.state.maxHp,ctx.state.hp + e.hp);
    calls.push(['tick',e.hp]);
  },
  petSpecialEffectSummary: (id, intimacy) => ['攻擊／受擊觸發能力（未有明確機率者不擅自設定）'],
  logMsg: msg => logs.push(msg)
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/v2_5_461_cat_nine_tail_recovery.js','utf8'),ctx);
const originalRandom=Math.random;
function check(label, fn) {
  if (!fn()) throw new Error('FAIL: '+label);
  checks.push(label);
}
const checks=[];
ctx.Math.random=()=>0.005;
check('Cordial intimacy: official 1% trigger starts 300 HP tick',()=>{
  const before=ctx.state.hp;
  const ok=ctx.tryPetCatNineTailRecovery({ranged:false,damage:100});
  const proc=ctx.state.activeItemRecoveryProcs[0];
  return ok && ctx.state.hp===before+300 && proc.hp===300 && proc.remaining===4 && proc.sp===0;
});
ctx.state.pet.intimacy=910;
ctx.Math.random=()=>0.005;
check('Loyal intimacy restores 400 HP per second',()=>{
  const before=ctx.state.hp;
  const ok=ctx.tryPetCatNineTailRecovery({ranged:false,damage:100});
  const proc=ctx.state.activeItemRecoveryProcs[1];
  return ok && ctx.state.hp===before+400 && proc.hp===400 && proc.remaining===4;
});
ctx.Math.random=()=>0.02;
const count=ctx.state.activeItemRecoveryProcs.length;
check('Roll above 1% does not proc',()=>ctx.tryPetCatNineTailRecovery({ranged:false,damage:100})===false && ctx.state.activeItemRecoveryProcs.length===count);
ctx.Math.random=()=>0.001;
check('Ranged physical attack does not proc',()=>ctx.tryPetCatNineTailRecovery({ranged:true,damage:100})===false && ctx.state.activeItemRecoveryProcs.length===count);
check('Zero damage does not proc',()=>ctx.tryPetCatNineTailRecovery({ranged:false,damage:0})===false && ctx.state.activeItemRecoveryProcs.length===count);
ctx.state.pet.intimacy=749;
check('Below cordial intimacy does not proc',()=>ctx.tryPetCatNineTailRecovery({ranged:false,damage:100})===false && ctx.state.activeItemRecoveryProcs.length===count);
ctx.state.pet={eggId:'moonlight_egg',intimacy:950};
check('Other pets are not affected',()=>ctx.tryPetCatNineTailRecovery({ranged:false,damage:100})===false && ctx.state.activeItemRecoveryProcs.length===count);
ctx.state.pet={eggId:'cat_o_nine_tail_egg',intimacy:950};
ctx.state.hp=0;
check('Dead character does not receive recovery proc',()=>ctx.tryPetCatNineTailRecovery({ranged:false,damage:100})===false && ctx.state.activeItemRecoveryProcs.length===count);
ctx.state.hp=100;
ctx.Math.random=()=>0.001;
check('Loyal summary reports implemented 1% / 400 HP effect',()=>{
  const rows=ctx.petSpecialEffectSummary('cat_o_nine_tail_egg',950);
  return rows.some(s=>s.includes('1%') && s.includes('400') && s.includes('已實裝'));
});
check('Cordial summary reports 300 HP effect',()=>{
  const rows=ctx.petSpecialEffectSummary('cat_o_nine_tail_egg',800);
  return rows.some(s=>s.includes('300') && s.includes('已實裝'));
});
check('Summary remains pending below cordial intimacy',()=>{
  const rows=ctx.petSpecialEffectSummary('cat_o_nine_tail_egg',749);
  return rows.some(s=>s.includes('未有明確機率'));
});
const engine=fs.readFileSync(__dirname + '/../js/engine.js','utf8');
check('Basic attack path invokes pet recovery hook',()=>engine.includes("tryPetCatNineTailRecovery({ ranged:isBowWeapon(getEquipBaseItemId('weapon')), damage:dmg })"));
check('Melee physical skill path invokes pet recovery hook',()=>engine.includes("if (!useMag && sk.rangeType !== 'ranged' && typeof tryPetCatNineTailRecovery"));
check('Melee physical area-skill hit path invokes pet recovery hook',()=>engine.includes('mon.hp -= dmg;') && engine.includes("if (!useMag && sk.rangeType !== 'ranged' && typeof tryPetCatNineTailRecovery"));
check('Pet recovery hook is not wired into generic skill recovery path',()=>!engine.includes("tryPetCatNineTailRecovery('attack'"));
console.log(`v2.5.461 Cat o' Nine Tails checks passed (${checks.length}):\\n- `+checks.join('\\n- '));
