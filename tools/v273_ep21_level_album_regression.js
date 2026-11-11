#!/usr/bin/env node
const fs=require('fs');
const e=fs.readFileSync('js/engine.js','utf8');
const d=fs.readFileSync('js/data.js','utf8');
const checks=[
 ['三轉等級上限275',/const BASE_LEVEL_CAP_ADVANCED = 275/.test(e)],
 ['一般基礎等級上限275',/const BASE_LEVEL_CAP = 275/.test(e)],
 ['250至275經驗曲線延伸',/\[275, 1\.0\]/.test(d)],
 ['老舊收集冊排除MVP卡',/card:\s*\{\s*build:\s*\(\)\s*=>\s*cardDrawable\(\)\.filter\(k\s*=>\s*bossCardKind\(k\)\s*!==\s*'mvp'\)/.test(e)],
 ['具有魔力卡冊僅抽MVP卡',/cardFlat:\s*\{\s*build:\s*\(\)\s*=>\s*cardDrawable\(\)\.filter\(k\s*=>\s*bossCardKind\(k\)\s*===\s*'mvp'\)/.test(e)],
 ['舊版老舊冊MVP額外抽獎已移除',!/if\s*\(kind\s*===\s*'card'\)\s*\{\s*if\s*\(Math\.random\(\)\s*<\s*0\.0001\)/.test(e)],
];let bad=0;for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)bad++;}console.log(`${checks.length-bad}/${checks.length} passed`);process.exit(bad?1:0);
