/* v2.5.408 — EP21 / 2026 Winter Hunt card runtime completion
 * Sources: Taiwan RO official notices 217971, 218097, 218118, 218126;
 * twRO item records 300505-300513 and 300719-300722.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const records = [
    ['ep21_jiaobeibei_card','腳貝貝卡片',300506,'weapon'],
    ['ep21_dudu_fish_card','嘟嘟魚卡片',300508,'footgear'],
    ['ep21_rockworm_card','碎岩巨蟲卡片',300511,'footgear'],
    ['ep21_letter_monster_card','書信怪卡片',300509,'footgear'],
    ['ep21_seabreeze_bird_card','海風鳥卡片',300505,'footgear'],
    ['ep21_velelling_card','貝雷波利卡片',300507,'weapon'],
    ['ep21_icehorn_card','冰角獸卡片',300513,'footgear'],
    ['winter_regenbeile_as_card','雷根貝勒亞斯卡片',300719,'weapon'],
    ['winter_regenbeile_kaiatos_card','雷根貝勒卡亞托斯卡片',300720,'weapon'],
    ['winter_regenbeile_totio_card','雷根貝勒拓堤奧卡片',300721,'garment'],
    ['winter_regenbeile_chairman_card','雷根貝勒會長雷根貝勒卡片',300722,'garment']
  ];
  for (const [id,name,itemId,slot] of records) {
    const c=CARDS[id];
    if (!c) continue;
    c.name=name;c.slot=slot;c.officialItemId=itemId;
    c.ep=id.startsWith('ep21_')?'EP21':'2026冬季狩獵祭';
    c.source=id.startsWith('ep21_')
      ? 'https://ro.gnjoy.com.tw/notice/notice_view.aspx?id=217971'
      : 'https://ro.gnjoy.com.tw/notice/notice_view.aspx?id=218097';
    c.searchTerms=[name];
    const item=ITEMS[id]||{};
    ITEMS[id]={...item,id,name,imgId:itemId,type:'material',icon:'🃏',weight:1,
      sell:item.sell??10,buyPrice:item.buyPrice??20,codexInclude:true,officialItemId:itemId,
      desc:`${c.desc||name} 系列：卡片；裝備：${slot==='weapon'?'武器':slot==='footgear'?'鞋子':'披肩'}；重量：1。`};
    window.CARD_ART_FALLBACKS=window.CARD_ART_FALLBACKS||{};
    window.CARD_ART_FALLBACKS[id]=`images/cards/generated/${id}.svg`;
    if(typeof CARD_ART_FALLBACKS!=='undefined') CARD_ART_FALLBACKS[id]=`images/cards/generated/${id}.svg`;
  }
  // 2026/01/20 official maintenance implemented the previously pending Hit Physical Damage property.
  // Tatio base +5%, every +2 refine +4%, and Helmut combo +5% are all independent additive terms.
  const tatio=CARDS.winter_regenbeile_totio_card;
  if(tatio){
    tatio.bonus={...(tatio.bonus||{}),hitDmgPct:5};
    tatio.condBonus=[
      {when:{},bonus:{per2Refine_hitDmgPct:4}},
      {when:{withCards:['helmut_regene_card']},bonus:{hitDmgPct:5}}
    ];
    tatio.desc='受到無屬性攻擊抗性-10%、未暴擊的普通物理攻擊與支援技能命中物理傷害+5%；披肩精煉每+2，命中物理傷害再+4%；搭配海茉特．雷根弗賴格卡片時，命中物理傷害再+5%。魔法、固定傷害及官方列出的排除技能不適用。';
    if(ITEMS.winter_regenbeile_totio_card) ITEMS.winter_regenbeile_totio_card.desc=tatio.desc+' 系列：卡片；裝備：披肩；重量：1。';
  }
  const chairman=CARDS.winter_regenbeile_chairman_card;
  if(chairman){
    chairman.condBonus=[
      {when:{},bonus:{per2Refine_critDmgPct:4}},
      {when:{withCards:['helmut_regene_card']},bonus:{critRate:15,critDmgPct:3}}
    ];
  }
  window.__V25408_CARD_RUNTIME_FIX__={version:'v2.5.408',records:records.filter(r=>!!CARDS[r[0]]).length,hitPhysicalDamage:'enabled',tatioBase:5,tatioPer2Refine:4,helmutCombo:5};
})();
