const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const engine = fs.readFileSync('js/engine.js', 'utf8');
const ui = fs.readFileSync('js/ui.js', 'utf8');
function extractFunction(src, signature) {
  const start = src.indexOf(signature); assert(start >= 0, 'missing ' + signature);
  const open = src.indexOf('{', start); let depth = 0, q = null, esc = false;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (q) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return src.slice(start, i + 1);
  }
  throw new Error('unclosed ' + signature);
}
const throttleFn = extractFunction(engine, 'function saveGameThrottled()');
const flushFn = extractFunction(engine, 'function flushPendingSave()');
const saveFn = extractFunction(engine, 'function saveGame()');
function harness() {
  let now = 100000, nextId = 1; const timers = new Map(), writes = [];
  const store = new Map([['ro_idle_save_slot_0', '']]);
  const ctx = {
    state: { name: 'Test', jobId: 'novice', createdAt: 1, mapId: 'field', lastActiveAt: 1,
      inventory: [], stats: {}, equip: {}, allies: [] },
    _allyActing: false, currentSlot: 0, MAX_SLOTS: 15,
    getSlotKey: n => 'ro_idle_save_slot_' + n,
    localStorage: { setItem(k,v) { writes.push([k,String(v)]); store.set(k,String(v)); }, getItem(k) { return store.has(k) ? store.get(k) : null; } },
    Date: { now: () => now }, JSON, Object, Array, Number, String, Math,
    lastSaveTs: 98000, saveFailureNotified: false, pendingSaveTimer: null, savePending: false,
    setTimeout(fn, delay) { const id = nextId++; timers.set(id, {fn, at: now + delay}); return id; },
    clearTimeout(id) { timers.delete(id); },
    console: { error() {} }, showToast() {}
  };
  vm.createContext(ctx);
  vm.runInContext('const SAVE_THROTTLE_MS=5000;' + throttleFn + flushFn + saveFn, ctx);
  function advance(ms) {
    now += ms;
    let ran = true;
    while (ran) { ran = false; for (const [id,t] of [...timers]) if (t.at <= now) { timers.delete(id); t.fn(); ran = true; } }
  }
  return {ctx, timers, writes, advance, store};
}
{
 const h = harness();
 h.ctx.saveGameThrottled(); h.ctx.saveGameThrottled(); h.ctx.saveGameThrottled();
 assert.strictEqual(h.timers.size, 1, 'multiple changes share one scheduled save');
 assert.strictEqual(h.writes.length, 0, 'no synchronous write inside throttle window');
 h.advance(2999); assert.strictEqual(h.writes.length, 0, 'save waits until max interval');
 h.advance(1); assert.strictEqual(h.writes.length, 1, 'one write occurs at the due time');
 assert.strictEqual(h.ctx.savePending, false);
}
{
 const h = harness(); h.ctx.saveGameThrottled();
 assert.strictEqual(h.timers.size, 1);
 assert.strictEqual(h.ctx.flushPendingSave(), true);
 assert.strictEqual(h.timers.size, 0, 'flush cancels timer');
 assert.strictEqual(h.writes.length, 1, 'flush writes pending progress immediately');
 assert.strictEqual(h.ctx.savePending, false);
}
{
 const h = harness(); h.ctx.saveGameThrottled();
 h.ctx.state.gold = 123;
 assert.strictEqual(h.ctx.saveGame(), true, 'critical direct save succeeds');
 assert.strictEqual(h.timers.size, 0, 'direct save cancels pending timer');
 assert.strictEqual(h.ctx.savePending, false);
 assert.strictEqual(JSON.parse(h.store.get('ro_idle_save_slot_0')).gold, 123);
}
{
 const h = harness(); h.ctx.saveGameThrottled();
 h.ctx._allyActing = true;
 assert.strictEqual(h.ctx.flushPendingSave(), true, 'ally snapshot never overwrites player save');
 assert.strictEqual(h.writes.length, 0);
}
{
 const fn = extractFunction(ui, 'function manualSave()');
 const calls = []; const ctx = { saveGame: () => false, showToast: m => calls.push(m) };
 vm.createContext(ctx); vm.runInContext(fn, ctx);
 assert.strictEqual(ctx.manualSave(), false);
 assert.strictEqual(calls.length, 0, 'failed manual save must not display success toast');
}

{
 const selectFn = extractFunction(ui, 'function selectSlot(slot)');
 const calls = []; const ctx = { currentSlot: 2, state: {}, flushPendingSave: () => { calls.push('flush:' + ctx.currentSlot); return true; },
   hasSave: () => false, goCreateNew: () => calls.push('create') };
 vm.createContext(ctx); vm.runInContext(selectFn, ctx); ctx.selectSlot(7);
 assert.deepStrictEqual(calls, ['flush:2', 'create'], 'old slot flushes before changing slot');
 assert.strictEqual(ctx.currentSlot, 7);
}


{
 const h = harness();
 h.ctx.localStorage.setItem = () => { throw Object.assign(new Error('quota'), {name:'QuotaExceededError'}); };
 h.ctx.saveGameThrottled(); h.advance(3000);
 assert.strictEqual(h.ctx.lastSaveTs, 103000, 'failed write updates retry throttle timestamp');
 h.ctx.saveGameThrottled();
 assert.strictEqual(h.timers.size, 1);
 const scheduled = [...h.timers.values()][0];
 assert.strictEqual(scheduled.at, 108000, 'high-frequency updates wait before retrying failed storage');
}

assert(engine.includes("window.addEventListener('pagehide', flushPendingSave)"), 'pagehide flush is registered');
console.log('PASS repeated tick saves coalesce into one write');
console.log('PASS pending save flushes immediately on pagehide/manual flush');
console.log('PASS direct critical save cancels scheduled duplicate');
console.log('PASS ally snapshot remains excluded');
console.log('PASS manual save never reports success on failure');
console.log('PASS slot switching flushes pending data to the old slot first');
console.log('PASS storage quota failures back off high-frequency retry attempts');
console.log('PASS pagehide flush hook is registered');
console.log('8/8 passed');
