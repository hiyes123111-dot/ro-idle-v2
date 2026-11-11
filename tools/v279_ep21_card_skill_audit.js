#!/usr/bin/env node
const fs=require('fs');
const data=fs.readFileSync('js/data.js','utf8');
const skills=fs.readFileSync('js/skills.js','utf8');
const cards=data.slice(data.indexOf('const CARDS'));
const check=(name,ok)=>{console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)process.exitCode=1;};
check('伊爾澤卡片三項效果連結到元素支配者四轉技能', ['v25_element_master_5','v25_element_master_6','v25_element_master_8'].every(id=>cards.includes('skillDmg_'+id+':1')));
check('萊茵哈爾特卡片兩個技能ID均存在',skills.includes("cd_arbitrium: { id:'cd_arbitrium'") && skills.includes("cd_divinus_flos: { id:'cd_divinus_flos'"));
check('未加入擴充職業的五張卡片明確標示暫不實裝', ['ep21_john_card','ep21_kunt_card','ep21_galacia_card','ep21_iana_card','ep21_nadoyou_card'].every(id=>{const i=cards.indexOf("'"+id+"':");const line=cards.slice(i,cards.indexOf('\n',i));return i>=0 && line.includes('效果暫不實裝')}));
check('EP21 18張卡片資料仍全部存在', (cards.match(/'ep21_[a-z_]+_card': \{id:'ep21_/g)||[]).length===18);
