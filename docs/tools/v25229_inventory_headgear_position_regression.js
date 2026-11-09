#!/usr/bin/env node
'use strict';
const fs = require('fs');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const checks = [
  ['頭飾依位置拆分為頭上／頭中／頭下', /head_top: '頭飾（上）'/.test(ui) && /head_mid: '頭飾（中）'/.test(ui) && /head_bottom: '頭飾（下）'/.test(ui)],
  ['背包防具頭飾子分類使用裝備描述位置欄位', /if \(d\.armorType === 'headgear'\)[\s\S]*?pos\.includes\('頭上'\)[\s\S]*?pos\.includes\('頭中'\)[\s\S]*?pos\.includes\('頭下'\)/.test(ui)],
  ['頭飾缺少位置標記時有安全預設分類', /if \(pos\.includes\('頭下'\)\) return 'head_bottom';\s*return 'head_top';/.test(ui)],
  ['原有防具分類仍保留鎧甲／盾牌／披風／鞋子／飾品', /leather: '鎧甲'/.test(ui) && /shield: '盾牌'/.test(ui) && /garment: '披風'/.test(ui) && /footgear: '鞋子'/.test(ui) && /accessory: '飾品'/.test(ui)],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failed = checks.filter(([, ok]) => !ok).length;
console.log(`v2.5.230 inventory headgear position: ${checks.length - failed}/${checks.length} passed`);
if (failed) process.exit(1);
