const fs = require('fs');
const vm = require('vm');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const start = ui.indexOf('const _inventoryViewCache = new WeakMap();');
const end = ui.indexOf('function renderInventoryTab()', start);
if (start < 0 || end < 0) throw new Error('cache helper block not found');
const helper = ui.slice(start, end);

const sandbox = {
  INV_CATEGORIES: [
    {key:'weapon'}, {key:'armor'}, {key:'card'}, {key:'relic'}, {key:'item'}
  ],
  ITEMS: {
    sword:{type:'weapon',weaponType:'sword',name:'Sword',sell:100},
    bow:{type:'weapon',weaponType:'bow',name:'Bow',sell:200},
    hat:{type:'armor',armorType:'headgear',desc:'頭上',name:'Hat',sell:50},
    card_a:{type:'card',name:'A Card',sell:10},
    potion:{type:'consumable',name:'Potion',sell:5},
    ore:{type:'material',name:'Ore',sell:2}
  },
  CARDS: {card_a:{slot:'weapon'}},

};
sandbox.invCategoryOf = id => {
  if (sandbox.CARDS[id]) return 'card';
  const d=sandbox.ITEMS[id];
  if (!d) return 'item';
  if (d.type==='weapon') return 'weapon';
  if (d.type==='armor') return 'armor';
  if (d.type==='relic') return 'relic';
  return 'item';
};
sandbox.invSubOf = id => {
  const cat=sandbox.invCategoryOf(id), d=sandbox.ITEMS[id];
  if (cat==='weapon') return d.weaponType || 'other';
  if (cat==='armor') return 'head_top';
  if (cat==='card') return sandbox.CARDS[id].slot || 'any';
  return d.type || 'etc';
};
sandbox.invQuickFilterMatch = (id,q) => q==='material' ? id==='ore' : q==='consumable' ? id==='potion' : false;
vm.createContext(sandbox);
vm.runInContext(helper, sandbox);

const rows = [
  {item:'sword',qty:2},
  {item:'bow',qty:1},
  {item:'hat',qty:1},
  {item:'card_a',qty:3},
  {item:'potion',qty:10},
  {item:'ore',qty:5},
  {item:'missing',qty:1}
];
const index1 = sandbox.getInventoryViewIndex(rows);
const index2 = sandbox.getInventoryViewIndex(rows);
if (index1 !== index2) throw new Error('index was not reused');
if (index1.known.length !== 6) throw new Error('unknown item was not excluded');
if (index1.categoryCounts.weapon !== 2 || index1.categoryCounts.card !== 1) throw new Error('category counts incorrect');
if (!index1.hasHeadgear || index1.subCounts.weapon.sword !== 1) throw new Error('subcategory counts incorrect');

const sorted = sandbox.getInventoryCachedRows(rows,'weapon','all','all','','name');
if (sorted.map(x=>x.item).join(',') !== 'bow,sword') throw new Error('name sorting incorrect');
const sortedAgain = sandbox.getInventoryCachedRows(rows,'weapon','all','all','','name');
if (sorted !== sortedAgain) throw new Error('query result was not cached');
if (sandbox.getInventoryCachedRows(rows,'weapon','sword','all','','none').length !== 1) throw new Error('subcategory filter incorrect');
if (sandbox.getInventoryCachedRows(rows,'item','all','material','','none').length !== 1) throw new Error('quick filter incorrect');
if (sandbox.getInventoryCachedRows(rows,'all','all','all','pot','name').length !== 1) throw new Error('search filter incorrect');

rows.push({item:'sword',qty:8});
sandbox.invalidateInventoryViewCache({inventory:rows});
const rebuilt = sandbox.getInventoryViewIndex(rows);
if (rebuilt === index1 || rebuilt.categoryCounts.weapon !== 3) throw new Error('invalidation did not rebuild index');
if (sandbox.getInventoryCachedRows(rows,'weapon','all','all','','qty')[0].qty !== 8) throw new Error('quantity sort after invalidation incorrect');

for (let n=0;n<60;n++) sandbox.getInventoryCachedRows(rows,'all','all','all','q'+n,'name');
if (rebuilt.queries.size > 48) throw new Error('query cache was not bounded');

console.log('PASS index reuse');
console.log('PASS known item filtering and category/subcategory counts');
console.log('PASS query filtering and sort cache');
console.log('PASS mutation invalidation and quantity sort refresh');
console.log('PASS query cache bounded to 48 entries');
const engine = fs.readFileSync('js/engine.js', 'utf8');
if (!/raw === _warehouseCacheRaw && _warehouseCacheObject/.test(engine)) throw new Error('warehouse parsed-object cache missing');
if (!/invalidateInventoryViewCache\(\{ inventory: wh\.items \}\)/.test(engine)) throw new Error('warehouse save does not invalidate item index');
if (!/function addItem\(itemId, qty\)[\s\S]*?invalidateInventoryViewCache\(inv\)/.test(engine)) throw new Error('addItem does not invalidate inventory index');
if (!/function removeItem\(itemId, qty\)[\s\S]*?invalidateInventoryViewCache\(owner\)/.test(engine)) throw new Error('removeItem does not invalidate inventory index');
console.log('PASS warehouse parse cache and inventory mutation invalidation');
console.log('6/6 passed');
