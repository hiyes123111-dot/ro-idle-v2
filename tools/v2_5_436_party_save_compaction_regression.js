const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('js/engine.js', 'utf8');
const start = src.indexOf('const ALLY_SNAPSHOT_DROP =');
const end = src.indexOf('// 其他存檔格裡可以雇的角色', start);
if (start < 0 || end < 0) throw new Error('ally snapshot section not found');
const section = src.slice(start, end);

const raw = {
  name: '暗影十字測試隊友', jobId: 'shadow_cross', mapId: 'safe_town',
  hp: 100, maxHp: 100, sp: 50, maxSp: 50,
  learnedSkills: { sonic_blow: 10 }, equip: { weapon: 'test_katar' },
  inventory: Array.from({length: 100}, (_, i) => ({item: 'item_' + i, qty: 1})),
  codex: { item: { huge: true } }, achievements: { done: {} },
  autoSellConfig: { enabled: true, items: Array.from({length: 12233}, (_, i) => 'item_' + i) },
  autoSellItems: Array.from({length: 100}, (_, i) => 'old_' + i),
  offlineLog: Array.from({length: 500}, (_, i) => ({at:i})),
  lootNotices: Array.from({length: 500}, (_, i) => ({id:i})),
  buffs: [{id:'buff', msRemaining:1000}], cooldowns: {test:1000}
};
const sandbox = { state: { mapId: 'high_exp_208' }, recomputeDerived: () => {}, Date };
vm.createContext(sandbox);
vm.runInContext(section, sandbox);
const ally = sandbox.buildAllySnapshot(raw, '4');
if (!ally) throw new Error('buildAllySnapshot returned null');
for (const key of ['autoSellConfig','autoSellItems','offlineLog','lootNotices','codex','achievements','inventory']) {
  if (Object.prototype.hasOwnProperty.call(ally, key) && key !== 'inventory') throw new Error('snapshot retained unnecessary ' + key);
}
if (!Array.isArray(ally.inventory) || ally.inventory.length !== 0) throw new Error('snapshot inventory must be empty array');
if (ally.jobId !== 'shadow_cross' || ally.mapId !== 'safe_town' || ally.learnedSkills.sonic_blow !== 10)
  throw new Error('snapshot lost core combat fields');
if (raw.autoSellConfig.items.length !== 12233 || raw.autoSellConfig.enabled !== true)
  throw new Error('building snapshot mutated owner auto-sell config');
const bytes = Buffer.byteLength(JSON.stringify(ally));
if (bytes > 30000) throw new Error('snapshot unexpectedly large: ' + bytes);

// Old stored snapshots are cleaned on load; owner config is not touched.
if (!/delete a\.autoSellConfig;/.test(src) || !/delete a\.autoSellItems;/.test(src))
  throw new Error('loadGame migration cleanup missing');

// saveGame must surface localStorage failures and recover its warning state after success.
const saveStart = src.indexOf('function saveGame() {');
const saveEnd = src.indexOf('\n}\nfunction loadGame()', saveStart);
if (saveStart < 0 || saveEnd < 0) throw new Error('saveGame not found');
const saveFn = src.slice(saveStart, saveEnd + 2);
const calls = {toast:[], set:0};
const saveSandbox = {
  state: {lastActiveAt:0, mapId:'high_exp_208', allies:[{_allyName:'暗影十字隊友',jobId:'shadow_cross',monsters:[],monster:{id:1}}]}, _allyActing:null, currentSlot:3,
  getSlotKey:slot=>'slot_'+slot,
  localStorage:{setItem(){calls.set++; throw Object.assign(new Error('quota'),{name:'QuotaExceededError'});}},
  showToast:m=>calls.toast.push(m), console:{error(){}}, Date,
};
vm.createContext(saveSandbox);
vm.runInContext('let lastSaveTs=0; let saveFailureNotified=false; '+saveFn+'; globalThis.getSaveFailureNotified=()=>saveFailureNotified;',saveSandbox);
saveSandbox.saveGame();
if (calls.toast.length !== 1 || !calls.toast[0].includes('存檔失敗')) throw new Error('quota failure did not notify user');
// Simulate successful storage and ensure the warning latch resets.
let stored = null;
saveSandbox.localStorage.setItem=(key,value)=>{calls.set++; stored={key,value};};
saveSandbox.saveGame();
if (saveSandbox.getSaveFailureNotified() !== false) throw new Error('save warning did not reset after success');
const roundTrip = JSON.parse(stored.value);
if (roundTrip.mapId !== 'high_exp_208' || roundTrip.allies.length !== 1 || roundTrip.allies[0].jobId !== 'shadow_cross')
  throw new Error('successful save did not preserve leader map and party roster');
console.log('PASS team snapshots omit huge player-only auto-sell/offline lists');
console.log('PASS owner auto-sell settings remain unchanged');
console.log('PASS legacy ally snapshots are migrated smaller');
console.log('PASS storage quota failure is surfaced and success resets warning');
console.log('PASS successful save preserves leader map and party roster across reload payload');
console.log('5/5 passed; compact snapshot bytes=' + bytes);
