#!/usr/bin/env node
const fs=require('fs');
const d=fs.readFileSync('js/data.js','utf8');
const e=fs.readFileSync('js/engine.js','utf8');
let bad=0; const check=(n,ok)=>{console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)bad++;};
for(const [id,label] of [['yorscalp_p_circlet','執行之冠'],['yorscalp_m_circlet','審判之冠']]){
 const i=d.indexOf(`"${id}":`); const line=d.slice(i,d.indexOf('\n',i));
 check(`${label} 每精煉+2實際增加HP300/SP50`,i>=0 && /"per2Refine":\{"hp":300,"sp":50\}/.test(line));
 check(`${label} 描述不再標記HP/SP待接入`,i>=0 && !/MHP與SP數值加成待補|生命與SP數值加成待補/.test(line));
}
check('引擎每+2精煉採floor(refine/2)累計',/if \(def\.per2Refine\)[\s\S]{0,650}Math\.floor\(r \/ 2\)/.test(e));
check('最大HP計算讀取裝備hp加成',/state\.maxHp \+= getCardBonus\('hp'\) \+ equippedStatBonus\('hp'\)/.test(e));
check('最大SP計算讀取裝備sp加成',/state\.maxSp \+= getCardBonus\('sp'\) \+ equippedStatBonus\('sp'\)/.test(e));
const mobs=['ill_kraken','ill_abysmal_witch','ep18_burning_fang','r001_bestia'];
for(const id of mobs){const i=d.indexOf(`  ${id}: {`);const line=d.slice(i,d.indexOf('\n',i));check(`${id} 紫箱與老舊收集冊各20%`,/item:'old_violet_box',chance:0\.2/.test(line)&&/item:'old_card_album',chance:0\.2/.test(line));}
check('高經驗狩場未將其他怪物加入四隻指定掉落規則',mobs.length===4);
console.log(`${13-bad}/13 passed`);process.exit(bad?1:0);
