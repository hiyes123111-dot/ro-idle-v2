#!/usr/bin/env node
const fs=require('fs');
const data=fs.readFileSync('js/data.js','utf8');
const skills=fs.readFileSync('js/skills.js','utf8');
const cards=data.slice(data.indexOf('const CARDS'));
const check=(name,ok)=>{console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)process.exitCode=1;};
check('伊爾澤卡片大地驅動連結到現存技能 rg_earthdrive',cards.includes('skillDmg_rg_earthdrive:1') && skills.includes("rg_earthdrive: { id: 'rg_earthdrive'"));
check('萊茵哈爾特卡片兩個技能ID均存在',skills.includes("cd_arbitrium: { id:'cd_arbitrium'") && skills.includes("cd_divinus_flos: { id:'cd_divinus_flos'"));
check('未完成技能連結有明確標示，不再宣稱精煉增傷已實裝',cards.includes('目前對應技能ID尚未在技能資料庫建立'));
check('EP21 18張卡片資料仍全部存在', (cards.match(/'ep21_[a-z_]+_card': \{id:'ep21_/g)||[]).length===18);
