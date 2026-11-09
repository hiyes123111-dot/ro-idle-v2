/* V2.5.5.72 — headgear audit round 16.
 * Implements explicit numeric refine effects only where the current bonus engine
 * has a matching key. Trigger probability / transformation / equipment-combo-only
 * effects remain documented in the audit rather than being guessed.
 */
(function () {
  if (typeof ITEMS === 'undefined') return;
  const audit = [];
  const item = id => ITEMS[id] || null;
  const merge = (id, field, value) => {
    const d = item(id); if (!d) return false;
    d[field] = Object.assign({}, d[field] || {}, value); return true;
  };
  const cond = (id, refineMin, bonus, extraWhen) => {
    const d = item(id); if (!d) return false;
    if (!Array.isArray(d.condBonus)) d.condBonus = [];
    const rule = { when: Object.assign({ refineMin }, extraWhen || {}), bonus };
    if (!d.condBonus.some(x => JSON.stringify(x) === JSON.stringify(rule))) d.condBonus.push(rule);
    return true;
  };
  const per = (id, field, bonus, start, cap) => {
    const d = item(id); if (!d) return false;
    d[field] = Object.assign({}, d[field] || {}, bonus);
    if (start != null) d[field + 'Start'] = start;
    if (cap != null) d.perRefineCap = cap;
    return true;
  };
  const add = (id, note, ok) => audit.push({ id, note, ok: !!ok });

  // 依精煉提升的抗異常效果，精煉上限依原文 +10。
  add('diabolus_helmet', '冰凍/石化/暈眩抗性每精煉+1各+2%，上限+10', per('diabolus_helmet','per1Refine',{ailResist_freeze:2,ailResist_stone:2,ailResist_stun:2},1,10));
  // 無屬性減傷每精煉+1%，從+6起；觸發雙劍格擋機率未提供數值，不猜測。
  add('tatenasi_helmet', '精煉+6起無屬性減傷每級+1%；格擋機率未量化', per('tatenasi_helmet','per1Refine',{neutralResistPct:1},6));
  // Boss傷害減免及HP增加描述沒有逐級數值，不轉換。
  add('chinese_crown_', 'Boss減傷依精煉但未提供每級數值；保留待資料來源確認', false);
  add('tiraya_bonnet', '精煉增加HP但未提供每級數值；保留待資料來源確認', false);
  add('southern_cross', '精煉+6起追加無視Boss魔防，但未提供每級數值；保留待確認', false);
  // 守護者耳朵的精煉條件是裝備組合及武器精煉，非頭具自身效果。
  add('karduiear', '精煉效果僅限指定盾牌/卡片組合，未有通用可套用規則', false);
  add('kardui_ear', '精煉效果僅限指定盾牌/卡片組合，未有通用可套用規則', false);
  // 時間守護者高帽：吸收量的增幅明確，但現有引擎沒有物理傷害吸收的裝備觸發器。
  add('toughen_time_keeper_hat', 'HP吸收每+3精煉+1%、SP吸收每+4精煉+1%；觸發型吸收系統未支援', false);
  // 小青：每+2經驗/掉寶、門檻HP/SP、恢復力；經驗/掉寶欄位有對應，恢復量欄位沒有。
  add('spirit_of_chung_e_', '每+2精煉經驗/掉寶+1%未有通用欄位；+4 HP/SP+1%；+12 HP/SP再+3%', (function(){
    const a=per('spirit_of_chung_e_','per2Refine',{});
    const b=cond('spirit_of_chung_e_',4,{hpPct:1,spPct:1});
    const c=cond('spirit_of_chung_e_',12,{hpPct:3,spPct:3}); return a&&b&&c;
  })());
  add('spirit_of_chung_e', '重複ID版本：經驗/掉寶每+2精煉增加但引擎未支援；+4及+12 HP/SP門檻', (function(){
    const a=per('spirit_of_chung_e','per2Refine',{});
    const b=cond('spirit_of_chung_e',4,{hpPct:1,spPct:1});
    const c=cond('spirit_of_chung_e',12,{hpPct:3,spPct:3}); return a&&b&&c;
  })());
  // 狸貓變身樹葉：明確每+1精煉全屬性魔法傷害+1%。
  add('smoky_transformhat', '每精煉+1全屬性魔法傷害+1%', per('smoky_transformhat','per1Refine',{magicAllDmgPct:1},1));
  add('smoky_transform_hat', '重複ID版本：每精煉+1全屬性魔法傷害+1%', per('smoky_transform_hat','per1Refine',{magicAllDmgPct:1},1));
  // 懶洋洋達納托斯苦惱：每+2對指定種族/屬性傷害+1%。
  add('dolor_hatk', '每+2精煉對聖/暗屬性及龍/天使物魔傷害+1%', per('dolor_hatk','per2Refine',{eleDmg_holy:1,eleDmg_shadow:1,raceDmg_dragon:1,raceDmg_angel:1},2));
  // 氣球帽與新鮮玫瑰只寫依精煉額外MATK，沒有數值，不能推定。
  add('balloon_hat', '依精煉額外MATK但未提供每級數值；保留待確認', false);
  add('lush_rose', '依精煉額外MATK但未提供每級數值；保留待確認', false);
  // 遊行帽：+6起每級追加技能後延遲減少(精煉-5)%；起點+6。
  add('parade_cap', '精煉+6起技能後延遲額外減少；引擎目前沒有獨立技能後延遲欄位，保留待實作', false);
  // 山茶花髮帶：地震術/崩裂術精煉每+1傷害+1%，技能ID映射須依現有技能表確認，保留。
  add('rjc_katusa', '地震術/崩裂術每精煉+1傷害+1%，技能ID需核對現有技能表', false);
  // 魔力兔帽+7：全屬性傷害減免5%與冰凍抗性5%。
  add('k_rabbit_bonnet', '精煉+7起冰凍抗性5%；全屬性減傷欄位尚未支援', cond('k_rabbit_bonnet',7,{ailResist_freeze:5}));
  // 尼芙菲姆兔帽：+5/+7/+9對尼芙菲姆怪傷害門檻。
  add('niflheim_bunny_hat', '精煉+5/+7/+9對尼芙菲姆怪物傷害+5/+10/+20%；專屬怪物分類未建立，保留待實作', false);
  // 心型羽翼髮帶：每+3精煉技能後延遲/SP消耗各再減3%。
  add('heart_wing_hairband', '每+3精煉技能後延遲與SP消耗再-3%', (function(){
    return merge('heart_wing_hairband','per3Refine',{spCostPct:-3});
  })());
  // 死靈騎士之盔：精煉+5起每級對魔物物理傷害+1%。
  add('lord_of_death', '精煉+5起每級物理傷害+1%', per('lord_of_death','per1Refine',{allTargetDmgPct:1},5));
  // MVP籃球帽：+12/+14各追加變動詠唱-1%。
  add('mvp_basketball', '精煉+12/+14變動詠唱各-1%；目前引擎沒有變動詠唱裝備加成欄位', false);
  // 土色帽子：每+2精煉聖屬性減傷+1%。
  add('gray_helmet', '每+2精煉聖屬性傷害減少1%', merge('gray_helmet','per2Refine',{eleReduce_holy:1}));
  // UFO波利帽子：+7變動詠唱-5%；+9技能後延遲-5%、攻速+5%。
  add('ufo_poring_hat', '精煉+9攻速+5%；+7變動詠唱及+9技能後延遲目前無對應欄位', cond('ufo_poring_hat',9,{aspdPct:5}));
  // 浩瀚天文髮帶：+6起每級對隕石術/碧血隕石減傷2%；每+3技能傷害+5%。
  add('astro_circle', '精煉+6起隕石術/碧血隕石減傷、每+3技能傷害；需技能專屬增減傷欄位，保留待實作', false);
  // 嘻哈帽：+12起每級人型傷害減免1%，最多+5級。
  add('hiphop_hat', '精煉+12起每級人型傷害減免1%，上限+5級', per('hiphop_hat','per1Refine',{raceDmgReduce_demihuman:1},13,17));
  // 索亞之書：+6/+8組合效果經驗加成各+5%，需卡片組合條件，目前保留。
  add('book_of_soyga', '精煉+6/+8加成僅對指定卡片組合生效，現有卡片組合條件需另建', false);
  // 小貓蕾絲髮帶：+9變動詠唱-10%；+12詠唱不中斷(機制未支援)。
  add('cat_lace_hairband_k', '精煉+9變動詠唱-10%、+12詠唱不中斷；目前引擎無對應欄位', false);
  // 魔術電路/組合書系列的效果寫在組合書內，實際裝備需另以產物ID套用。
  add('bs_item_m_s_18', '組合書效果屬魔術電路成品，需套用成品裝備ID；不將效果加到材料書', false);
  add('bs_item_m_s_23', '組合書效果屬汪福將軍帽成品，需套用成品裝備ID；不將效果加到材料書', false);
  add('bs_item_m_s_24', '組合書效果屬經典羽毛帽成品，需套用成品裝備ID；不將效果加到材料書', false);
  add('bs_item_m_s_26', '組合書效果屬常勝將軍頭盔成品，需套用成品裝備ID；不將效果加到材料書', false);

  window.V2572_HEADGEAR_ROUND16_AUDIT = { version:'2.5.5.72', applied:audit.filter(x=>x.ok).map(x=>x.id), reviewed:audit.length, missing:audit.filter(x=>!x.ok).map(x=>x.id), details:audit };
})();
