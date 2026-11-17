const fs = require('fs');
const vm = require('vm');
const calls = [];
const logs = [];
const ctx = {
  console, Date, Math,
  state: { pet: { eggId:'tamadora_egg', intimacy:800, hunger:80 }, hp:50, maxHp:100 },
  ITEMS: {},
  tryAutoSpells: function(trigger) { calls.push(['base', trigger]); },
  castSkill: function(id, opts) { calls.push(['cast', id, opts]); return true; },
  logMsg: function(msg, lane) { logs.push([msg,lane]); }
};
vm.createContext(ctx);
for (const file of ['data.js','v2_5_456_pet_system.js','v2_5_457_pet_effect_completion.js','v2_5_458_pet_trigger_skills.js']) {
  vm.runInContext(fs.readFileSync(__dirname + '/../js/' + file, 'utf8'), ctx, {filename:file});
}
const checks=[];
function check(label, fn) { if (!fn()) throw new Error('FAIL: '+label); checks.push(label); }
ctx.Math.random = () => 0.005;
ctx.tryAutoSpells('attack', {});
check('Tamadora cordial physical hit triggers Heal Lv1 at 1%', () => calls.some(x => x[0]==='cast' && x[1]==='heal' && x[2].forceLv===1 && x[2].free===true));
check('trigger log is recorded in skill lane', () => logs.some(x => x[0].includes('治癒術 Lv1') && x[1]==='skill'));
check('panel no longer marks Tamadora auto-heal as pending', () => ctx.petSpecialEffectSummary('tamadora_egg',800).some(x => x.includes('1% 自動施展治癒術 Lv1（已實裝）')) && !ctx.petSpecialEffectSummary('tamadora_egg',800).some(x => x.includes('尚未接入寵物自動施法流程') || x.includes('需逐項接入技能流程')));
const before=calls.filter(x=>x[0]==='cast').length;
ctx.state.pet.intimacy=749; ctx.tryAutoSpells('attack',{});
check('below cordial intimacy does not trigger', () => calls.filter(x=>x[0]==='cast').length===before);
ctx.state.pet.intimacy=800; ctx.Math.random=()=>0.02; ctx.tryAutoSpells('attack',{});
check('roll above 1% does not trigger', () => calls.filter(x=>x[0]==='cast').length===before);
ctx.Math.random=()=>0.001; ctx.state.hp=100; ctx.tryAutoSpells('attack',{});
check('full HP skips wasted heal proc', () => calls.filter(x=>x[0]==='cast').length===before);
ctx.state.hp=50; ctx.tryAutoSpells('magic',{});
check('magic trigger does not activate physical-hit pet proc', () => calls.filter(x=>x[0]==='cast').length===before);
console.log(`v2.5.458 pet trigger checks passed (${checks.length}):\n- `+checks.join('\n- '));
