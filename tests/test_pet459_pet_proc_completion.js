const fs = require('fs');
const vm = require('vm');
let now = 100000;
const calls = [];
const logs = [];
const ctx = {
  console,
  Date: class extends Date { static now() { return now; } },
  state: { pet: { eggId:'tamadora_egg', intimacy:950, hunger:80 }, hp:50, maxHp:100 },
  castSkill: (id, opts) => { calls.push([id, opts]); return true; },
  skillLv: id => ctx.learnedKyrieLv || 0,
  applyItemRecoveryTick: e => { ctx.state.hp = Math.min(ctx.state.maxHp, ctx.state.hp + e.hp); calls.push(['recoveryTick', e]); },
  tryItemRecoveryProcs: trigger => { calls.push(['baseRecovery', trigger]); return true; },
  logMsg: msg => logs.push(msg),
  saveGameThrottled: () => calls.push(['save']),
  renderInventoryTab: () => calls.push(['renderInventory']),
  renderTopBar: () => calls.push(['renderTop']),
  renderPetPanel: () => '<section>\n    <div class="dim" style="font-size:.82em;margin-top:8px">care</div>\n</section>',
  petSpecialEffectSummary: (eggId, intimacy) => eggId === 'tamadora_egg' && intimacy >= 910
    ? ['非常親密時額外開放治癒術 Lv1 使用權（手動技能介面尚未接入）'] : []
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/v2_5_459_pet_proc_completion.js','utf8'), ctx);
const checks=[];
function check(label, fn) { if (!fn()) throw new Error('FAIL: '+label); checks.push(label); }
check('manual Heal Lv1 button appears at loyal intimacy', () => ctx.renderPetPanel().includes('手動施放治癒術 Lv1'));
ctx.state.pet.intimacy=909;
check('manual button is hidden below loyal intimacy', () => !ctx.renderPetPanel().includes('手動施放治癒術 Lv1'));
check('manual skill is rejected below loyal intimacy', () => ctx.usePetGrantedManualSkill() === false && calls.length === 0);
ctx.state.pet.intimacy=950;
check('manual Heal Lv1 uses the existing skill pipeline', () => ctx.usePetGrantedManualSkill() === true && calls.some(x => x[0]==='heal' && x[1].free === true && x[1].forceLv === 1));
const castCount = calls.filter(x => x[0] === 'heal').length;
check('pet skill has a four-second cooldown', () => ctx.usePetGrantedManualSkill() === false && calls.filter(x => x[0] === 'heal').length === castCount);
now += 4000;
ctx.state.hp=100;
check('full HP skips manual healing', () => ctx.usePetGrantedManualSkill() === false && calls.filter(x => x[0] === 'heal').length === castCount);
ctx.state.hp=40;
check('manual skill can be used again after cooldown', () => ctx.usePetGrantedManualSkill() === true && calls.filter(x => x[0] === 'heal').length === castCount + 1);
check('pet summary no longer says manual interface is pending', () => ctx.petSpecialEffectSummary('tamadora_egg',950).some(x => x.includes('已實裝')) && !ctx.petSpecialEffectSummary('tamadora_egg',950).some(x => x.includes('尚未接入')));

ctx.state.pet = { eggId:'blue_moon_loli_ruri_egg', intimacy:800 };
ctx.state.hp=80;
ctx.Math = Math;
const originalRandom = Math.random;
Math.random = () => 0.01;
check('Blue Moon Loli Ruri 2% proc casts Kyrie Lv2 on physical damage', () => ctx.tryPetOnPhysicalDamageTaken(100) === true && calls.some(x => x[0]==='kyrie' && x[1].forceLv===2));
const kyrieCount = calls.filter(x => x[0]==='kyrie').length;
ctx.learnedKyrieLv=5;
check('higher learned Kyrie level is used', () => ctx.tryPetOnPhysicalDamageTaken(100) === true && calls.filter(x => x[0]==='kyrie').length===kyrieCount+1 && calls.filter(x => x[0]==='kyrie').at(-1)[1].forceLv===5);
Math.random = () => 0.03;
const afterMissChance = calls.filter(x => x[0]==='kyrie').length;
check('roll above official 2% does not trigger', () => ctx.tryPetOnPhysicalDamageTaken(100) === false && calls.filter(x => x[0]==='kyrie').length===afterMissChance);
Math.random = () => 0.001;
ctx.state.pet.intimacy=749;
check('Blue Moon Loli Ruri proc requires cordial intimacy', () => ctx.tryPetOnPhysicalDamageTaken(100) === false);
ctx.state.pet.intimacy=800;
check('zero physical damage does not trigger', () => ctx.tryPetOnPhysicalDamageTaken(0) === false);
const engine = fs.readFileSync(__dirname + '/../js/engine.js','utf8');
check('monster physical skill damage path calls pet on-hit hook', () => engine.includes("if (!sk.magic && dmg > 0 && state.hp > 0 && typeof tryPetOnPhysicalDamageTaken"));
check('monster normal physical attack path calls pet on-hit hook', () => engine.includes("if (dmg > 0 && state.hp > 0 && typeof tryPetOnPhysicalDamageTaken"));
check('normal physical attack passes ranged status to pet hook', () => engine.includes("{ ranged:!!rangedBasicAttack, kind:'basic' }"));

ctx.state.pet = { eggId:'loli_ruri_egg', intimacy:800 };
Math.random = () => 0.005;
const healBeforeLoli = calls.filter(x => x[0]==='heal').length;
check('Loli Ruri cordial physical hit has official 1% Heal Lv1 proc', () => ctx.tryPetOnPhysicalDamageTaken(20,{ranged:false,kind:'basic'}) === true && calls.filter(x => x[0]==='heal').length===healBeforeLoli+1 && calls.filter(x => x[0]==='heal').at(-1)[1].forceLv===1);
ctx.state.pet.intimacy=950;
check('Loli Ruri loyal physical hit uses Heal Lv2', () => ctx.tryPetOnPhysicalDamageTaken(20,{ranged:false,kind:'basic'}) === true && calls.filter(x => x[0]==='heal').at(-1)[1].forceLv===2);

const healBeforeLoliSkill = calls.filter(x => x[0]==='heal').length;
check('Loli Ruri only reacts to normal physical attacks, not physical skills', () => ctx.tryPetOnPhysicalDamageTaken(20,{ranged:false,kind:'skill'}) === false && calls.filter(x => x[0]==='heal').length===healBeforeLoliSkill);

const healBeforeRanged = calls.filter(x => x[0]==='heal').length;
check('Loli Ruri does not proc from ranged physical attacks', () => ctx.tryPetOnPhysicalDamageTaken(20,{ranged:true}) === false && calls.filter(x => x[0]==='heal').length===healBeforeRanged);

ctx.state.pet = { eggId:'moonlight_egg', intimacy:300 };
ctx.state.hp=10;
Math.random = () => 0.005;
check('Moonlight neutral proc adds 5 HP ticks at 300 HP each', () => {
  const before=ctx.state.hp;
  ctx.tryItemRecoveryProcs('attack');
  const proc=ctx.state.activeItemRecoveryProcs.at(-1);
  return ctx.state.hp===Math.min(ctx.state.maxHp,before+300) && proc.hp===300 && proc.sp===0 && proc.remaining===4;
});
ctx.state.pet.intimacy=800;
Math.random = () => 0.015;
check('Moonlight cordial proc uses 2% and 400 HP per second', () => {
  ctx.tryItemRecoveryProcs('attack');
  return ctx.state.activeItemRecoveryProcs.at(-1).hp===400;
});
ctx.state.pet.intimacy=950;
Math.random = () => 0.025;
check('Moonlight loyal proc uses 3% and 500 HP per second', () => {
  ctx.tryItemRecoveryProcs('attack');
  return ctx.state.activeItemRecoveryProcs.at(-1).hp===500;
});
const procCount = ctx.state.activeItemRecoveryProcs.length;
Math.random = () => 0.04;
check('Moonlight roll above the tier chance does not create a recovery proc', () => {
  ctx.tryItemRecoveryProcs('attack');
  return ctx.state.activeItemRecoveryProcs.length===procCount;
});
check('Moonlight recovery summary discloses HP implementation and SP limitation', () => {
  const rows=ctx.petSpecialEffectSummary('moonlight_egg',950);
  return rows.some(x=>x.includes('3%') && x.includes('500') && x.includes('SP 恢復未接入'));
});


check('Blue Moon summary marks the 2% Kyrie proc implemented', () => ctx.petSpecialEffectSummary('blue_moon_loli_ruri_egg',800).some(x=>x.includes('2%') && x.includes('已實裝')));
check('Loli Ruri summary marks the 1% Heal proc implemented', () => ctx.petSpecialEffectSummary('loli_ruri_egg',950).some(x=>x.includes('1%') && x.includes('治癒術 Lv2') && x.includes('已實裝')));

Math.random = originalRandom;

console.log(`v2.5.459 pet trigger checks passed (${checks.length}):\n- `+checks.join('\n- '));
