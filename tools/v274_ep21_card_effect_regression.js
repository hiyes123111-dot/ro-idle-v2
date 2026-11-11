#!/usr/bin/env node
const fs=require('fs');
const d=fs.readFileSync('js/data.js','utf8');
const e=fs.readFileSync('js/engine.js','utf8');
const cases={
  ep21_tris_card:['v25_dragon_knight_6','v25_dragon_knight_7'],
  ep21_tan_borg_card:['v25_imperial_guard_12','v25_imperial_guard_13'],
  ep21_bihailin_card:['v25_inquisitor_6','v25_inquisitor_8'],
  ep21_reinhardt_card:['cd_arbitrium','cd_divinus_flos'],
  ep21_evan_wigner_card:['v25_meister_10','v25_meister_8'],
  ep21_lalila_card:['v25_biolo_3','v25_biolo_4'],
  ep21_richard_card:['v25_shadow_cross_3','v25_shadow_cross_4'],
  ep21_lora_card:['v25_abyss_chaser_11','v25_abyss_chaser_10'],
  ep21_aurely_card:['v25_arch_mage_3','v25_arch_mage_6'],
  ep21_ylze_card:['v25_element_master_5','v25_element_master_6','v25_element_master_8'],
  ep21_mary_stella_card:['v25_troubadour_15','v25_troubadour_14'],
};
let bad=0; const check=(n,ok)=>{console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)bad++;};
for(const [id,skills] of Object.entries(cases)){
 const i=d.indexOf(`'${id}': {id:'${id}'`,d.indexOf('const CARDS'));
 const line=d.slice(i,d.indexOf('\n',i));
 check(`${id} 每精煉+1對應技能各+1%`,i>=0 && skills.every(s=>line.includes(`skillDmg_${s}:1`)));
}
check('老舊收集冊 MVP 總機率固定 0.01%',/kind === 'card'[\s\S]{0,260}Math\.random\(\) < 0\.0001/.test(e));
check('具有魔力卡冊只抽MVP',/cardFlat:\s*\{\s*build:\s*\(\)\s*=>\s*cardDrawable\(\)\.filter\(k\s*=>\s*bossCardKind\(k\)\s*===\s*'mvp'\)/.test(e));
console.log(`${Object.keys(cases).length+2-bad}/${Object.keys(cases).length+2} passed`);process.exit(bad?1:0);
