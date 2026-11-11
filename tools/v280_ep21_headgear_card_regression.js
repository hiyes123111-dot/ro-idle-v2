#!/usr/bin/env node
const fs=require('fs');
const d=fs.readFileSync('js/data.js','utf8');
const e=fs.readFileSync('js/engine.js','utf8');
let bad=0; const check=(n,ok)=>{console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)bad++;};
for(const [id,img] of [['yorscalp_p_circlet',400723],['yorscalp_m_circlet',400724]]){
 const re=new RegExp('"'+id+'": \\{([^\\n]+)'); const m=d.match(re); const line=m&&m[1]||'';
 check(`${id} 是可裝備頭上防具`,line.includes('"type":"armor"')&&line.includes('"armorType":"headgear"')&&line.includes('"slots":1'));
 check(`${id} 官方道具編號與等級正確`,line.includes(`"imgId":${img}`)&&line.includes('"reqLevel":250')&&line.includes('"def":50'));
}
const physical=['ep21_tris_card','ep21_tan_borg_card','ep21_bihailin_card','ep21_evan_wigner_card','ep21_lalila_card','ep21_richard_card','ep21_mary_stella_card'];
const magical=['ep21_reinhardt_card','ep21_lora_card','ep21_aurely_card','ep21_ylze_card'];
for(const [ids,crown] of [[physical,'yorscalp_p_circlet'],[magical,'yorscalp_m_circlet']]) for(const id of ids){
 const i=d.indexOf(`'${id}': {id:'${id}'`,d.indexOf('const CARDS')); const line=i>=0?d.slice(i,d.indexOf('\n',i)):'';
 check(`${id} 指定正確頭冠、A階及+10門檻`,line.includes(`withItems:['${crown}']`)&&line.includes("itemGradeMin:'A'")&&line.includes('itemRefineMin:10')&&line.includes('perItem1Refine_skillDmg_'));
}
check('卡片引擎讀取指定裝備精煉倍率',/const itemPm = \/\^perItem\(\\d\+\)Refine_/.test(e)&&/targetRefine = targets\.reduce/.test(e));
check('指定裝備精煉及階級條件均有判斷',/if \(when\.itemRefineMin != null\)/.test(e)&&/if \(when\.itemGradeMin != null\)/.test(e));
console.log(`${17-bad}/17 passed`);process.exit(bad?1:0);
