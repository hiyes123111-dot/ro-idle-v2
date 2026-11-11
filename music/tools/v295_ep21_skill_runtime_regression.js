const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..','js');
const ctx={console,window:{},Math,Set,Map,Object,Array,String,Number,RegExp};vm.createContext(ctx);
for(const file of ['skills.js','monster_skills.js','jobs.js','data.js','relics.js','v2_content.js','v2_4_content.js','v2_5_content.js'])
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file,timeout:20000});
const cases={
 ep21_tris_card:[['v25_dragon_knight_6','橫揮斬'],['v25_dragon_knight_7','風暴斬擊']],
 ep21_tan_borg_card:[['v25_imperial_guard_12','瞬間斬擊'],['v25_imperial_guard_13','帝國十字斬']],
 ep21_bihailin_card:[['v25_inquisitor_6','爆破衝擊'],['v25_inquisitor_8','烈焰爆彈']],
 ep21_reinhardt_card:[['cd_arbitrium','制裁謳歌'],['cd_divinus_flos','神聖花雨']],
 ep21_evan_wigner_card:[['v25_meister_10','能量轟炸'],['v25_meister_8','閃光衝擊波']],
 ep21_lalila_card:[['v25_biolo_3','神秘粉末'],['v25_biolo_4','星塵炸裂']],
 ep21_richard_card:[['v25_shadow_cross_3','十字斬擊'],['v25_shadow_cross_4','永恆斬擊']],
 ep21_lora_card:[['v25_abyss_chaser_11','深淵之焰'],['v25_abyss_chaser_10','深淵墳場']],
 ep21_aurely_card:[['v25_arch_mage_3','萬紫千紅'],['v25_arch_mage_6','毀滅颶風']],
 ep21_ylze_card:[['v25_element_master_5','灼熱岩漿'],['v25_element_master_6','雷霆陣地'],['v25_element_master_8','大地驅動']],
 ep21_epesto_card:[['v25_windhawk_progressive_shot','漸進射擊'],['sn_sharpshooting','銳利射擊']],
 ep21_mary_stella_card:[['v25_troubadour_15','玫瑰箭矢'],['v25_troubadour_14','節奏射擊']],
 ep21_lee_card:[['v25_arch_mage_20','雷鳴術風暴'],['v25_arch_mage_21','新霜凍術']]
};
let checks=0;
for(const [cardId,pairs] of Object.entries(cases)){
 const card=vm.runInContext(`CARDS['${cardId}']`,ctx);if(!card)throw new Error('Missing '+cardId);
 for(const [id,name] of pairs){
  const skill=vm.runInContext(`SKILLS['${id}']`,ctx);
  if(!skill)throw new Error(`${cardId}: skill ${id} absent after actual runtime registration`);
  if(skill.name!==name)throw new Error(`${cardId}: ${id} name ${skill.name} != ${name}`);
  if(!Object.prototype.hasOwnProperty.call(card.perRefine||{},'skillDmg_'+id))throw new Error(`${cardId}: missing weapon refine key for ${id}`);
  const cond=(card.condBonus||[]).some(r=>r.bonus&&Object.prototype.hasOwnProperty.call(r.bonus,'perItem1Refine_skillDmg_'+id));
  if(!cond)throw new Error(`${cardId}: missing headgear refine key for ${id}`);
  checks++;
 }
}
const audit=vm.runInContext('window.EP21_CARD_SKILL_AUDIT',ctx);
if(!audit||audit.implemented!==13||audit.deferred!==5)throw new Error('Runtime EP21 audit mismatch: '+JSON.stringify(audit));
for(const id of ['ep21_john_card','ep21_kunt_card','ep21_galacia_card','ep21_iana_card','ep21_nadoyou_card']){
 const card=vm.runInContext(`CARDS['${id}']`,ctx);
 if(Object.keys(card.perRefine||{}).some(k=>k.startsWith('skillDmg_'))||(card.condBonus||[]).some(r=>Object.keys(r.bonus||{}).some(k=>k.includes('skillDmg_'))))throw new Error(id+' deferred card has active skill bonus');
}
console.log(`PASS: runtime registered ${checks} exact skill links across 13 cards; 5 unsupported cards remain inactive; runtime audit ${audit.implemented}/13 + ${audit.deferred}/5`);
