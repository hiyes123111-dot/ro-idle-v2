#!/usr/bin/env node
const fs = require('fs');
const src = fs.readFileSync('js/engine.js', 'utf8');
const checks = [
  ['老舊收集冊主池排除 MVP', /card:\s*\{\s*build:\s*\(\)\s*=>\s*cardDrawable\(\)\.filter\(k\s*=>\s*bossCardKind\(k\)\s*!==\s*'mvp'\)/.test(src)],
  ['老舊收集冊 MVP 總機率為 0.01%', /if\s*\(kind\s*===\s*'card'\)\s*\{\s*if\s*\(Math\.random\(\)\s*<\s*0\.0001\)/.test(src)],
  ['MVP 獎池涵蓋所有可開出的 MVP 卡', /const eligible = cardDrawable\(\)\.filter\(card\s*=>\s*bossCardKind\(card\)\s*===\s*'mvp'\)/.test(src)],
  ['其他卡冊保留原稀有獎勵流程', /if\s*\(kind\s*===\s*'cardFlat'\s*\|\|\s*kind\s*===\s*'card_garment'\)/.test(src)],
];
let failed = 0;
for (const [name, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) failed++; }
console.log(`${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
