#!/usr/bin/env node
const fs = require('fs');
const src = fs.readFileSync('js/engine.js', 'utf8');
const checks = [
  ['老舊收集冊主池排除 MVP', /card:\s*\{\s*build:\s*\(\)\s*=>\s*cardDrawable\(\)\.filter\(k\s*=>\s*bossCardKind\(k\)\s*!==\s*'mvp'\)/.test(src)],
  ['具有魔力的卡片冊專收 MVP', /cardFlat:\s*\{\s*build:\s*\(\)\s*=>\s*cardDrawable\(\)\.filter\(k\s*=>\s*bossCardKind\(k\)\s*===\s*'mvp'\)/.test(src)],
  ['舊版老舊收集冊 MVP 額外抽取已移除', !/if\s*\(kind\s*===\s*'card'\)\s*\{\s*if\s*\(Math\.random\(\)\s*<\s*0\.0001\)/.test(src)],
  ['魔力卡冊不再與一般卡池混抽', !/if\s*\(kind\s*===\s*'cardFlat'\s*\|\|\s*kind\s*===\s*'card_garment'\)/.test(src)],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
