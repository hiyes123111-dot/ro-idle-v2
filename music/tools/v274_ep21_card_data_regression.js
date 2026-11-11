#!/usr/bin/env node
const fs=require('fs');
const d=fs.readFileSync('js/data.js','utf8'), e=fs.readFileSync('js/engine.js','utf8'), u=fs.readFileSync('js/ui.js','utf8');
const ids=['ep21_tris_card','ep21_tan_borg_card','ep21_bihailin_card','ep21_reinhardt_card','ep21_evan_wigner_card','ep21_lalila_card','ep21_richard_card','ep21_lora_card','ep21_aurely_card','ep21_ylze_card','ep21_epesto_card','ep21_mary_stella_card','ep21_john_card','ep21_kunt_card','ep21_galacia_card','ep21_iana_card','ep21_lee_card','ep21_nadoyou_card'];
let bad=0; const check=(n,ok)=>{console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)bad++;};
check('EP21官方卡片18張全數有CARDS定義',ids.every(id=>new RegExp("['\"]"+id+"['\"]\\s*:").test(d.slice(d.indexOf('const CARDS')))));
check('EP21官方卡片18張全數有ITEMS定義',ids.every(id=>new RegExp("['\"]"+id+"['\"]\\s*:").test(d.slice(0,d.indexOf('const MONSTERS')))));
check('EP21特殊王卡均分入魔力卡冊',ids.every(id=>e.includes("'"+id+"'")) && /cardFlat:\s*\{\s*build:\s*\(\)\s*=>\s*cardDrawable\(\)\.filter\(k\s*=>\s*bossCardKind\(k\)\s*===\s*'mvp'\)/.test(e));
check('無怪物來源卡片顯示卡冊來源',u.includes('getCardAcquisitionSource') && u.includes('albumRows'));
console.log(`${4-bad}/4 passed`);process.exit(bad?1:0);
