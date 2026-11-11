#!/usr/bin/env node
'use strict';
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync('js/data.js', 'utf8') + '\n;globalThis.__audit={ITEMS,MONSTERS,CARDS,MAPS,MONSTER_CARD_DROPS,REGIONS};';
const context = { console };
vm.createContext(context);
vm.runInContext(source, context, { timeout: 20000 });
const { ITEMS, MONSTERS, CARDS, MAPS, MONSTER_CARD_DROPS, REGIONS } = context.__audit;
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const map = MAPS.find(x => x.id === 'tower_memory_high');
assert(map, '塔之記憶・高層狩場地圖存在');
assert(REGIONS.some(r => r.maps.includes(map.id)), '地圖已加入古城區域');
for (const id of ['empathizer', 'dame_of_sentinel', 'c3_observation']) {
  assert(MONSTERS[id], `怪物資料存在：${id}`);
  assert(map.monsters.some(m => m.id === id), `地圖有配置怪物：${id}`);
}
for (const id of ['empathizer_card', 'observation_card']) {
  assert(ITEMS[id] && CARDS[id], `卡片道具與效果資料存在：${id}`);
}
assert(MONSTER_CARD_DROPS.empathizer.card === 'empathizer_card', '共感者掉落共感者卡片');
assert(MONSTER_CARD_DROPS.dame_of_sentinel.card === 'observation_card', '監視者掉落監視者卡片');
const empathizer = CARDS.empathizer_card;
assert(empathizer.slot === 'garment', '共感者卡片插在披肩');
assert(empathizer.bonus.rangedDmgPct === 10, '共感者卡片基本遠距離物理傷害 +10%');
assert(empathizer.bonus.spPct === -25, '共感者卡片 MaxSP -25%');
const set = empathizer.condBonus[0];
assert(set.when.baseLevelMin === 200, '套卡要求 Base Lv.200');
assert(set.when.withCards.includes('observation_card'), '套卡要求監視者卡片');
assert(set.bonus.perStat_dex_40_rangedDmgPct === 15, '每40基本DEX額外遠距離物理傷害 +15%');
assert(CARDS.observation_card.bonus.perStat_vit_18_dex === 1, '監視者卡片每18基本VIT DEX +1');
console.log('PASS: Tower Memory map, 3 monsters, 2 cards, drop sources, and card combo data');
