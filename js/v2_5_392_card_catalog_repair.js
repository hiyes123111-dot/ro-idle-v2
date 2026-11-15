/* v2.5.392 — 仙境全書卡片資料補完
 * 來源頁：仙境全書「卡片(飾品)」https://ro.ntome.com/item/card/acc
 * 參考來源非官方資料庫；依來源頁效果與本遊戲已支援的 bonus key 對應。
 * 未臆造怪物掉率或魔物掉落來源；新增卡片先進入卡冊池與圖鑑。
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const added = [];
  const definitions = {
    ash_toad_card: { id: 'ash_toad_card', name: '灰燼蟾蜍卡片', icon: '🃏', slot: 'accessory', bonus: {"magicEleDmg_earth":35,"spCostPct":10}, desc: '地屬性魔法傷害+35%；使用技能時SP消耗量+10%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    ash_locust_card: { id: 'ash_locust_card', name: '灰燼蝗蟲卡片', icon: '🃏', slot: 'accessory', bonus: {"magicEleDmg_none":35,"spCostPct":10}, desc: '無屬性魔法傷害+35%；使用技能時SP消耗量+10%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    windfire_eagle_card: { id: 'windfire_eagle_card', name: '風火老鷹卡片', icon: '🃏', slot: 'accessory', bonus: {"magicEleDmg_wind":35,"spCostPct":10}, desc: '風屬性魔法傷害+35%；使用技能時SP消耗量+10%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    kraboli_card: { id: 'kraboli_card', name: '克拉波利卡片', icon: '🃏', slot: 'accessory', bonus: {"magicEleDmg_water":35,"spCostPct":10}, desc: '水屬性魔法傷害+35%；使用技能時SP消耗量+10%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    jennifer_card: { id: 'jennifer_card', name: '珍妮佛卡片', icon: '🃏', slot: 'accessory', bonus: {"magicEleDmg_poison":20,"magicEleDmg_undead":20}, desc: '毒屬性、不死屬性魔法傷害+20%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    cave_kraboli_card: { id: 'cave_kraboli_card', name: '洞穴克拉波利卡片', icon: '🃏', slot: 'accessory', bonus: {"magicEleDmg_poison":35,"spCostPct":10}, desc: '毒屬性魔法傷害+35%；使用技能時SP消耗量+10%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    dispo_card: { id: 'dispo_card', name: '迪斯波卡片', icon: '🃏', slot: 'accessory', bonus: {"magicEleDmg_holy":35,"spCostPct":10}, desc: '聖屬性魔法傷害+35%；使用技能時SP消耗量+10%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    good_rabbit_card: { id: 'good_rabbit_card', name: '好想兔卡片', icon: '🃏', slot: 'accessory', bonus: {"hpPct":15}, desc: 'MaxHP+15%；搭配小賤狗卡片時，MaxHP、MaxSP再+5%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    small_bad_dog_card: { id: 'small_bad_dog_card', name: '小賤狗卡片', icon: '🃏', slot: 'accessory', bonus: {"spPct":15}, desc: 'MaxSP+15%；搭配好想兔卡片時，MaxHP、MaxSP再+5%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    yerker_servant_card: { id: 'yerker_servant_card', name: '耶爾克使役者卡片', icon: '🃏', slot: 'accessory', bonus: {"crit":5,"variableCastPct":-7}, desc: 'CRI+5，變動詠唱-7%；與耶爾克教役者卡片搭配時，C.Rate+2、暴擊傷害+12%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    yerker_officiant_card: { id: 'yerker_officiant_card', name: '耶爾克教役者卡片', icon: '🃏', slot: 'accessory', bonus: {"crit":5,"variableCastPct":-7}, desc: 'CRI+5，變動詠唱-7%；與耶爾克使役者卡片搭配時，C.Rate+2、暴擊傷害+12%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    summer_pope_card: { id: 'summer_pope_card', name: '暑假教皇卡片', icon: '🃏', slot: 'accessory', bonus: {"meleeDmgPct":3,"rangedDmgPct":3,"magicAllDmgPct":3}, desc: '近距離、遠距離物理傷害及全屬性魔法傷害+3%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    soul_guide_card: { id: 'soul_guide_card', name: '靈魂引渡者卡片', icon: '🃏', slot: 'accessory', bonus: {"meleeDmgPct":25,"hpPct":-20}, desc: '近距離物理傷害+25%，MaxHP-20%；基本STR達70時無視體型懲罰；Base Lv.230以上時近距離物理傷害再+45%、VIT-20。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    peska_card: { id: 'peska_card', name: '沛斯卡卡片', icon: '🃏', slot: 'accessory', bonus: {"hpPct":-20,"raceDmg_angel":25,"raceDmg_inanimate":25,"eleDmg_holy":25,"eleDmg_none":25}, desc: 'MaxHP-20%；對天使型、無形魔物的物理傷害+25%，對聖屬性、無屬性目標的物理傷害+25%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
    summer_malan_card: { id: 'summer_malan_card', name: '暑假馬藍卡片', icon: '🃏', slot: 'accessory', bonus: {"atkPct":3,"matkPct":3,"crit":4,"variableCastPct":-4}, desc: 'ATK+3%、MATK+3%、CRI+4、變動詠唱-4%。', source: 'https://ro.ntome.com/item/card/acc', addedVersion: 'v2.5.392' },
  };
  Object.entries(definitions).forEach(([id, card]) => {
    if (!CARDS[id]) {
      // 兩張成對卡片的官方套裝條件。
      if (id === 'good_rabbit_card') card.condBonus = [{ when: { withCards: ['small_bad_dog_card'] }, bonus: { hpPct: 5, spPct: 5 } }];
      
      if (id === 'yerker_servant_card') {
        card.condBonus = [{ when: { withCards: ['yerker_officiant_card'] }, bonus: { cRate: 2, critDmgPct: 12 } }];
      }
      if (id === 'soul_guide_card') card.condBonus = [
        { when: { statMin: { str: 70 } }, bonus: { ignoreSizePenalty: 1 } },
        { when: { baseLevelMin: 230 }, bonus: { meleeDmgPct: 45, vit: -20 } }
      ];
      CARDS[id] = card;
      added.push(id);
    }
    const c = CARDS[id];
    if (!ITEMS[id]) {
      const slotName = ({ accessory: '飾品' })[c.slot] || '飾品';
      ITEMS[id] = {
        id, imgId: 0, name: c.name, type: 'material', icon: '🃏',
        weight: 1, sell: 10, buyPrice: 20, codexInclude: true,
        addedVersion: 'v2.5.392',
        desc: `${c.desc || '卡片效果資料。'} 系列：卡片；裝備：${slotName}；來源：卡冊。`
      };
    }
  });

  // 原有「熔岩蟾蜍卡片」已存在，但部位與效果和仙境全書資料不一致；
  // 依來源修正為飾品卡：火屬性魔法傷害 +35%，SP 消耗 +10%。
  if (CARDS.lava_toad_card) {
    CARDS.lava_toad_card.slot = 'accessory';
    CARDS.lava_toad_card.bonus = { magicEleDmg_fire: 35, spCostPct: 10 };
    CARDS.lava_toad_card.desc = '火屬性魔法傷害+35%；使用技能時SP消耗量+10%。飾品卡片。';
  }
  if (ITEMS.lava_toad_card) {
    ITEMS.lava_toad_card.desc = '火屬性魔法傷害+35%；使用技能時SP消耗量+10%。 系列：卡片；裝備：飾品；來源：卡冊。';
    ITEMS.lava_toad_card.addedVersion = 'v2.5.392';
  }

  // 卡片資料池與圖鑑簽章會依 ITEMS/CARDS 動態重算；不清除玩家收藏或存檔。
  window.__V25392_CARD_AUDIT__ = {
    version: 'v2.5.392',
    added,
    corrected: ['lava_toad_card'],
    totalCards: Object.keys(CARDS).filter(id => /卡片$/.test((CARDS[id] || {}).name || '') && ITEMS[id]).length,
    missingItemRecords: Object.keys(CARDS).filter(id => /卡片$/.test((CARDS[id] || {}).name || '') && !ITEMS[id])
  };
})();