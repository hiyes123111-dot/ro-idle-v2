const fs = require('fs');
const vm = require('vm');
let now = 200000;
const casts = [];
const logs = [];
const ctx = {
  console,
  Date: class extends Date { static now() { return now; } },
  state: {
    pet: { eggId:'tamadora_egg', intimacy:950, hunger:80 },
    hp:70, maxHp:100, monsters:[{hp:500}]
  },
  castSkill: (id, opts) => {
    casts.push([id, opts]);
    ctx.state.hp = Math.min(ctx.state.maxHp, ctx.state.hp + 20);
    return true;
  },
  skillLv: () => 0,
  applyItemRecoveryTick: e => { ctx.state.hp = Math.min(ctx.state.maxHp, ctx.state.hp + e.hp); },
  tryItemRecoveryProcs: () => true,
  logMsg: msg => logs.push(msg),
  saveGameThrottled: () => {},
  saveGame: () => {},
  renderInventoryTab: () => {},
  renderTopBar: () => {},
  renderPetPanel: () => '<section><button class="btn-small" onclick="usePetGrantedManualSkill();">✨ 手動施放治癒術 Lv1</button></section>',
  petSpecialEffectSummary: () => [],
  gameTick: () => { ctx.tickCount = (ctx.tickCount || 0) + 1; }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/v2_5_459_pet_proc_completion.js','utf8'), ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../js/v2_5_460_tamadora_auto_heal.js','utf8'), ctx);
const checks=[];
function check(label, fn) { if (!fn()) throw new Error('FAIL: '+label); checks.push(label); }

check('Tamadora panel exposes auto-heal toggle', () => ctx.renderPetPanel().includes('自動戰鬥時自動治癒'));
check('default auto-heal threshold is 70%', () => ctx.renderPetPanel().includes('value="70"'));
check('manual heal button remains available', () => ctx.renderPetPanel().includes('手動施放治癒術 Lv1'));
check('auto-heal defaults enabled for existing loyal Tamadora', () => ctx.tamadoraAutoHealEnabled(ctx.state.pet) === true);

ctx.state.hp = 71;
ctx.gameTick();
check('does not auto-heal above 70% HP', () => casts.length === 0);
ctx.state.hp = 70;
ctx.gameTick();
check('auto-heals at exactly 70% HP during combat', () => casts.length === 1 && casts[0][0] === 'heal' && casts[0][1].free === true && casts[0][1].forceLv === 1);
check('auto-heal shares the four-second pet cooldown', () => {
  ctx.state.hp = 50;
  ctx.gameTick();
  return casts.length === 1;
});

check('manual heal cannot bypass the automatic cooldown', () => ctx.usePetGrantedManualSkill() === false && casts.length === 1);
now += 4000;
ctx.state.hp = 50;
check('manual heal works after shared cooldown', () => ctx.usePetGrantedManualSkill() === true && casts.length === 2);
check('manual heal refreshes shared cooldown', () => {
  ctx.state.hp = 50;
  ctx.gameTick();
  return casts.length === 2;
});

now += 4000;
ctx.state.hp = 50;
check('auto-heal resumes after cooldown', () => {
  ctx.gameTick();
  return casts.length === 3;
});

now += 4000;
ctx.state.hp = 60;
ctx.setTamadoraAutoHealEnabled(false);
check('player can disable automatic healing', () => ctx.tamadoraAutoHealEnabled(ctx.state.pet) === false);
ctx.gameTick();
check('disabled auto-heal does not cast', () => casts.length === 3);

ctx.setTamadoraAutoHealEnabled(true);
ctx.setTamadoraAutoHealThreshold(80);
ctx.state.hp = 80;
now += 4000;
ctx.gameTick();
check('custom HP threshold is applied', () => casts.length === 4);
ctx.setTamadoraAutoHealThreshold(120);
check('threshold is clamped to 99%', () => ctx.state.pet.autoHealHpThreshold === 99);

now += 4000;
ctx.state.hp = 40;
ctx.state.monsters = [];
ctx.gameTick();
check('no automatic heal when no living monsters are present', () => casts.length === 4);
ctx.state.monsters = [{hp:100}];
ctx.state.hp = 100;
ctx.gameTick();
check('full HP never triggers automatic heal', () => casts.length === 4);
ctx.state.hp = 40;
ctx.state.hp = 0;
ctx.gameTick();
check('downed character never triggers automatic heal', () => casts.length === 4);

ctx.state.hp = 40;
ctx.state.pet.intimacy = 909;
ctx.gameTick();
check('intimacy below 910 cannot auto-heal', () => casts.length === 4);
ctx.state.pet.intimacy = 950;
ctx.state.pet.eggId = 'moonlight_egg';
ctx.state.hp = 40;
ctx.gameTick();
check('other pets cannot use Tamadora auto-heal', () => casts.length === 4);

const index = fs.readFileSync(__dirname + '/../index.html','utf8');
const sw = fs.readFileSync(__dirname + '/../sw.js','utf8');
const version = fs.readFileSync(__dirname + '/../VERSION.txt','utf8').trim();
check('version marker is 2.5.481', () => version === 'v2.5.481');
check('new runtime script is loaded with matching cache version', () => index.includes('v2_5_460_tamadora_auto_heal.js?v=2.5.481'));
check('HTML asset query versions are consistent', () => !/\\?v=2\\.5\\.(?!466)[^"']+/.test(index));
check('Service Worker runtime cache matches release', () => sw.includes('ro-idle-runtime-v2.5.481'));

console.log(`v2.5.460 Tamadora auto-heal checks passed (${checks.length}):\n- `+checks.join('\n- '));
