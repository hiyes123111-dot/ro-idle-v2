const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const files = [...html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)]
  .map(m => m[1]).filter(f => f.startsWith('js/'));
const end = files.indexOf('js/engine.js');
const ctx = {
  console, window: {}, CARD_ART_FALLBACKS: {},
  document: { addEventListener(){}, removeEventListener(){}, getElementById(){return null;},
    querySelector(){return null;}, querySelectorAll(){return [];}, createElement(){return {};},
    body: { appendChild(){}, classList: { add(){}, remove(){} } } },
  Image: function(){}, localStorage: {getItem(){return null;},setItem(){},removeItem(){}},
  setTimeout(){return 0;}, clearTimeout(){}, setInterval(){return 0;}, clearInterval(){},
  requestAnimationFrame(){return 0;}, performance:{now(){return 0;}},
  Math, Date, Map, Set, Array, Object, Number, String, JSON, RegExp, Float64Array
};
ctx.window = ctx; vm.createContext(ctx);
for (const f of files.slice(0, end + 1)) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, {filename:f, timeout:60000});
}
const cards = vm.runInContext('CARDS', ctx);
const items = vm.runInContext('ITEMS', ctx);
let generatedAssets = 0;
const missingItems = [];
const missingGeneratedAssets = [];
for (const [id, card] of Object.entries(cards)) {
  if (!items[id]) missingItems.push(id);
  const fallback = ctx.CARD_ART_FALLBACKS[id];
  if (fallback) {
    generatedAssets++;
    if (!fs.existsSync(path.join(root, fallback))) missingGeneratedAssets.push({id, fallback});
  }
}
assert.deepStrictEqual(missingItems, [], 'Every card must have an ITEMS entry');
assert.deepStrictEqual(missingGeneratedAssets, [], 'Every registered generated card image must exist');
assert(ui.includes('const cellImage = cardDef ? cardArtSrc(r.id) : itemImgSrc(r.id);'), 'Card codex cells must use card art, not generic item art');
assert(ui.includes('${card ? cardArtSrc(id) : itemImgSrc(id)}'), 'Card detail header must use card art');
assert(ui.includes('${cardArtSrc(cd.card)}'), 'Monster card-drop rows must use card art');
assert(ui.includes("this.onerror=null;this.src='${placeholderImgSrc('card')}'"), 'Card image failures must show a card placeholder');
console.log(JSON.stringify({passed:5, cards:Object.keys(cards).length, generatedAssets, missingItems:missingItems.length, missingGeneratedAssets:missingGeneratedAssets.length,
  checks:['all cards have item records','all registered generated card art files exist','codex card cells use card art','card detail header uses card art','monster card-drop rows use card art and fallback']}, null, 2));
