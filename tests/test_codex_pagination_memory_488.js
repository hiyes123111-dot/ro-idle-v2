const fs = require('fs');
const vm = require('vm');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)]
  .map(m => m[1]).filter(f => f.startsWith('js/'));
const element = { innerHTML: '' };
const ctx = {
  console, document: { getElementById(id) { return id === 'tab-codex' ? element : null; }, addEventListener() {}, removeEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, createElement() { return { getContext() { return { clearRect() {}, drawImage() {} }; } }; }, body: { appendChild() {}, classList: { add() {}, remove() {}, contains() { return false; } } } },
  window: {}, Date, Math, Map, Set, Array, Object, Number, String, JSON, RegExp,
  Image: function Image() { this.src = ''; this.removeAttribute = () => {}; }, Audio: function Audio() {},
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setTimeout() { return 1; }, clearTimeout() {}, setInterval() { return 1; }, clearInterval() {},
  requestAnimationFrame() { return 1; }, cancelAnimationFrame() {}, performance: { now() { return 0; } }
};
ctx.window = ctx;
vm.createContext(ctx);
for (const file of files) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file, timeout: 60000 });
}
const run = source => vm.runInContext(source, ctx);

run(`
  state = { name: 'CodexMemoryTest' };
  codexView = 'item'; codexFilter = 'all'; codexSearch = ''; codexPage = 0;
  codexCat.item = 'all'; codexJobFilter = false;
  Array.from({length: 5000}, (_, i) => { ITEMS['item_' + i] = { name: '測試道具 ' + i, type: 'material' }; });
  getCodexPool = () => ({ monsters: [], cards: [], items: Array.from({length: 5000}, (_, i) => 'item_' + i) });
  ensureCodex = () => ({ seen: {}, item: {}, box: {}, mon: {} });
  getCodexProgress = () => ({ monsters: {found:0,total:0}, cards:{found:0,total:0}, items:{found:0,total:5000} });
  codexBar = () => ''; codexBoxBar = () => ''; codexCatBar = () => ''; codexSubBar = () => '';
  codexCatFilter = ids => ids; codexSubFilter = ids => ids;
  window.__rendered = [];
  codexItemCell = row => { window.__rendered.push(row.id); return '<div></div>'; };
`);
run('renderCodexTab()');
assert.strictEqual(run('window.__rendered.length'), 60, 'first item page creates only 60 row objects');
assert.strictEqual(run("window.__rendered[0]"), 'item_0');
assert.strictEqual(run("window.__rendered[59]"), 'item_59');
assert.ok(run("document.getElementById('tab-codex').innerHTML.includes('共 5000 筆')"), 'pager still reports the full filtered result count');

run('window.__rendered = []; codexPage = 40; renderCodexTab()');
assert.strictEqual(run('window.__rendered.length'), 60, 'last full page still creates only one page of rows');
assert.strictEqual(run("window.__rendered[0]"), 'item_2400');
assert.strictEqual(run("window.__rendered[59]"), 'item_2459');

run(`codexView = 'hidden'; codexPage = 0; window.__rendered = [];
  getAlbumOnlyCards = () => []; getBoxCodexPool = () => Array.from({length: 5000}, (_, i) => 'item_' + i);
  codexBoxCell = row => { window.__rendered.push(row.id); return '<div></div>'; };
  renderCodexTab();`);
assert.strictEqual(run('window.__rendered.length'), 60, 'hidden codex also paginates before creating row objects');
console.log('v2.5.491 codex pagination memory checks passed (7)');
