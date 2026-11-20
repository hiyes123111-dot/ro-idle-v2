const fs = require('fs');
const vm = require('vm');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)]
  .map(m => m[1]).filter(f => f.startsWith('js/'));
const classes = { add() {}, remove() {}, contains() { return false; } };
const elements = new Proxy({}, { get(target, id) {
  if (!target[id]) target[id] = {
    classList: classes, style: {}, textContent: '', innerHTML: '',
    addEventListener() {}, removeAttribute() {}, getContext() { return { clearRect() {}, drawImage() {} }; }
  };
  return target[id];
}});
const clearedIntervals = [];
const clearedTimeouts = [];
const cancelledFrames = [];
const ctx = {
  console, CARD_ART_FALLBACKS: {},
  document: {
    addEventListener() {}, removeEventListener() {},
    getElementById(id) { return elements[id]; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    createElement() { return { getContext() { return { clearRect() {}, drawImage() {} }; } }; },
    body: { appendChild() {}, classList: classes }
  },
  window: {}, Image: function Image() { this.src = ''; this.removeAttribute = name => { if (name === 'src') this.src = ''; }; }, Audio: function Audio() {},
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout() { return 101; }, clearTimeout(id) { clearedTimeouts.push(id); },
  setInterval() { return 102; }, clearInterval(id) { clearedIntervals.push(id); },
  requestAnimationFrame() { return 103; }, cancelAnimationFrame(id) { cancelledFrames.push(id); },
  performance: { now() { return 0; } }, Math, Date, Map, Set, Array, Object,
  Number, String, JSON, RegExp, Float64Array
};
ctx.window = ctx;
vm.createContext(ctx);
for (const file of files) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file, timeout: 60000 });
}
const run = source => vm.runInContext(source, ctx);

// Exit path flushes character logs before dropping the character state and clears transient caches.
run(`
  state = { name: 'MemoryTest', muted: true, bgmVolume: 0.35 };
  saveGame = () => true;
  stopLoop = () => { _loopOn = false; };
  stopAnim = () => {};
  stopCastAnim = () => {};
  stopMusic = () => {};
  playTitleMusic = () => {};
  _combatLogPersistTimer = 88;
  _combatLogHistoryLoadedKey = 'old-character';
  combatLogBuf.push('old log');
  combatLogLanes.main.push('old main');
  _lastLogLane = 'ally';
  saveCombatLogHistory = () => { window.__savedLogOwner = state && state.name; };
  _logRafId = 77;
  _logDirty = true;
  animFrameImages.old_job = [{}];
  animFramesLoaded.old_job = true;
  spriteMetrics.old_job = { scale: 1 };
  animCacheGeneration = 4;
  animTimer = 55;
  castAnimTimer = 56;
  animating = true;
  castingAnim = true;
  currentAnimKey = 'old_job';
  baseAnimKey = 'old_job';
  animSizedKey = 'old_job';
  _gearBonusCache = { atk: 99 };
  _gearBonusKey = 'old-character';
  _activeSets.push({ id: 'old-set' });
`);
run('backToTitle()');
assert.strictEqual(run('window.__savedLogOwner'), 'MemoryTest', 'combat log is persisted with the outgoing character identity');
assert.strictEqual(run('state'), null, 'outgoing character state is released after successful save');
assert.strictEqual(run('_combatLogPersistTimer'), null);
assert.strictEqual(run('_combatLogHistoryLoadedKey'), null);
assert.strictEqual(run('combatLogBuf.length'), 0);
assert.strictEqual(run('combatLogLanes.main.length'), 0);
assert.strictEqual(run("_lastLogLane"), 'main');
assert.strictEqual(run('_logRafId'), 0);
assert.strictEqual(run('_logDirty'), false);
assert.ok(cancelledFrames.includes(77), 'pending log animation frame is cancelled');
assert.ok(clearedTimeouts.includes(88), 'pending combat-log persistence timer is cancelled after flush');
assert.strictEqual(run('animCacheGeneration'), 5);
assert.strictEqual(run('Object.keys(animFrameImages).length'), 0);
assert.strictEqual(run('Object.keys(animFramesLoaded).length'), 0);
assert.strictEqual(run('Object.keys(spriteMetrics).length'), 0);
assert.strictEqual(run('animTimer'), null);
assert.strictEqual(run('castAnimTimer'), null);
assert.strictEqual(run('animating'), false);
assert.strictEqual(run('castingAnim'), false);
assert.strictEqual(run('baseAnimKey'), null);
assert.strictEqual(run('_gearBonusCache'), null);
assert.strictEqual(run('_gearBonusKey'), '');
assert.strictEqual(run('_activeSets.length'), 0);
assert.strictEqual(run('titleMusicMuted'), true, 'title music mute preference survives state release');
assert.strictEqual(run('titleMusicVolume'), 0.35, 'title music volume survives state release');

// Failed save must not drop state or start the release path.
run(`state = { name: 'Unsaved', muted: false, bgmVolume: 0.5 }; saveGame = () => false; animCacheGeneration = 9;`);
run('backToTitle()');
assert.strictEqual(run("state.name"), 'Unsaved', 'failed save retains character state in memory');
assert.strictEqual(run('animCacheGeneration'), 9, 'failed save does not evict current character animation resources');

// Pending image requests are cancelled and cannot repopulate the cache after a character switch.
const pendingFrames = run("loadAnimFrames('pending_job')");
assert.strictEqual(run('animPendingLoads.size'), 20, 'all in-flight sprite image requests are tracked');
run('releaseCharacterAnimationResources()');
assert.strictEqual(run('animPendingLoads.size'), 0, 'character release cancels every in-flight image request');
pendingFrames.then(() => {
  assert.strictEqual(run("Object.keys(animFrameImages).length"), 0, 'cancelled old-generation images do not refill the cache');
  console.log('v2.5.491 character memory-release checks passed (30)');
});
