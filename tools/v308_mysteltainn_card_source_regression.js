#!/usr/bin/env node
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('js/data.js','utf8')+'\n;globalThis.__audit={ITEMS,MONSTERS,CARDS,MAPS,MONSTER_CARD_DROPS};';
const ctx={};vm.createContext(ctx);vm.runInContext(src,ctx,{timeout:30000});
const {ITEMS,MONSTERS,CARDS,MAPS,MONSTER_CARD_DROPS}=ctx.__audit;
const c=CARDS.mysteltainn_card;
assert(c,'弒神者卡片 CARDS 存在');
assert(ITEMS.mysteltainn_card,'弒神者卡片 ITEMS 存在');
assert(c.monsterId==='mysteltainn','卡片來源 monsterId 正確');
assert(MONSTERS.mysteltainn,'怪物定義存在');
assert(MAPS.some(m=>m.id==='gl_knt02'&&(m.monsters||[]).some(x=>x.id==='mysteltainn')),'古城騎士團02配置怪物');
assert(MONSTER_CARD_DROPS.mysteltainn.card==='mysteltainn_card','怪物掉落映射正確');
assert(MONSTER_CARD_DROPS.mysteltainn.chance===0.0005,'本遊戲卡片掉率 0.05%');
console.log('PASS: Mysteltainn monster, card item, codex source, gl_knt02 spawn, and card drop mapping');
