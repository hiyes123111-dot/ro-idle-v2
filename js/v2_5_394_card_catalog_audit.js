/* v2.5.394 — 仙境全書飾品卡片效果補正與缺漏補入
 * Reference: https://ro.ntome.com/item/card/acc
 * Unverified monster drop sources are intentionally not fabricated; these entries are album/codex discoverable.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const source = 'https://ro.ntome.com/item/card/acc';
  const added = [];
  const define = (id, name, bonus, desc, extra = {}) => {
    if (!CARDS[id]) {
      CARDS[id] = { id, name, icon: '🃏', slot: 'accessory', bonus, desc, source, addedVersion: 'v2.5.394', ...extra };
      added.push(id);
    }
    if (!ITEMS[id]) {
      ITEMS[id] = { id, imgId: 0, name, type: 'material', icon: '🃏', weight: 1, sell: 10, buyPrice: 20,
        codexInclude: true, addedVersion: 'v2.5.394', desc: `${desc} 系列：卡片；裝備：飾品；來源：卡冊（怪物掉落來源待核實）。` };
    } else {
      ITEMS[id].codexInclude = true;
      ITEMS[id].addedVersion = ITEMS[id].addedVersion || 'v2.5.394';
    }
  };

  // 補正 v2.5.392 已加入卡片：依仙境全書完整效果補齊，不覆寫既有取得紀錄。
  if (CARDS.good_rabbit_card) {
    CARDS.good_rabbit_card.bonus = { ...(CARDS.good_rabbit_card.bonus || {}), hpPct: 15, expGainPct: 10 };
    CARDS.good_rabbit_card.desc = 'MHP+15%；搭配小賤狗卡片時，MHP、MSP再+5%；擊殺怪物獲得經驗值+10%。';
    CARDS.good_rabbit_card.condBonus = [{ when: { withCards: ['small_bad_dog_card'] }, bonus: { hpPct: 5, spPct: 5 } }];
    if (ITEMS.good_rabbit_card) ITEMS.good_rabbit_card.desc = CARDS.good_rabbit_card.desc + ' 系列：卡片；裝備：飾品；來源：卡冊。';
  }
  if (CARDS.summer_pope_card) {
    CARDS.summer_pope_card.bonus = { meleeDmgPct: 3, rangedDmgPct: 3, magicAllDmgPct: 3 };
    CARDS.summer_pope_card.condBonus = [{ when: { withItems: ['sesrumnir_evt_ring'] }, bonus: { meleeDmgPct: 4, rangedDmgPct: 4, magicAllDmgPct: 4 } }];
    CARDS.summer_pope_card.desc = '近距離／遠距離物理傷害、全屬性魔法傷害+3%；搭配瑟斯隆尼勒紀念戒指時，上述增傷總計+7%。';
    if (ITEMS.summer_pope_card) ITEMS.summer_pope_card.desc = CARDS.summer_pope_card.desc + ' 系列：卡片；裝備：飾品左；來源：卡冊。';
  }
  if (CARDS.summer_malan_card) {
    CARDS.summer_malan_card.bonus = { atkPct: 3, matkPct: 3, crit: 4, variableCastPct: -4 };
    CARDS.summer_malan_card.condBonus = [{ when: { withCards: ['summer_pope_card'] }, bonus: { atkPct: 4, matkPct: 4, skillAfterDelayPct: 5 } }];
    CARDS.summer_malan_card.desc = 'ATK+3%、MATK+3%、CRI+4、變動詠唱-4%；搭配暑假教皇卡片時，ATK、MATK總計+7%，技能後延遲-5%。';
    if (ITEMS.summer_malan_card) ITEMS.summer_malan_card.desc = CARDS.summer_malan_card.desc + ' 系列：卡片；裝備：飾品；來源：卡冊。';
  }
  if (CARDS.yerker_servant_card) CARDS.yerker_servant_card.desc = 'CRI+5、變動詠唱-7%；搭配耶爾克教役者卡片時，C.Rate+2、暴擊傷害+12%。';
  if (CARDS.yerker_officiant_card) CARDS.yerker_officiant_card.desc = 'CRI+5、變動詠唱-7%；搭配耶爾克使役者卡片時，C.Rate+2、暴擊傷害+12%。';

  // 仙境全書 2026-11-14 可見資料中已列出、但 v2.5.393 CARDS 尚未建檔的飾品卡。
  define('giant_kafert_card', '巨人卡夫特卡片', { raceDmg_formless: 5 }, '對無型魔物的物理傷害+5%；BaseLv.200以上時再增加+15%。', {
    condBonus: [{ when: { baseLevelMin: 200 }, bonus: { raceDmg_formless: 15 } }]
  });
  define('dororian_card', '多洛里安卡片', { raceDmg_demon: 5 }, '對惡魔型魔物的物理傷害+5%；BaseLv.200以上時再增加+15%。', {
    condBonus: [{ when: { baseLevelMin: 200 }, bonus: { raceDmg_demon: 15 } }]
  });
  define('crow_baron_card', '鴉魔男爵卡片', { afterAttackDelayPct: 5 }, '攻擊後延遲-5%；BaseLv.200以上時，火／風屬性魔法傷害+15%。搭配鴉魔首領卡片且賢者系列裝備時，火箭術／雷擊術傷害+30%。', {
    condBonus: [
      { when: { baseLevelMin: 200 }, bonus: { magicEleDmg_fire: 15, magicEleDmg_wind: 15 } },
      { when: { withCards: ['crow_boss_card'], jobLine: 'sage' }, bonus: { skillDmg_firebolt: 30, skillDmg_lightningbolt: 30 } }
    ]
  });
  define('crow_boss_card', '鴉魔首領卡片', { matkPct: 5 }, 'MATK+5%；BaseLv.200以上時，水／地屬性魔法傷害+15%。搭配鴉魔男爵卡片且賢者系列裝備時，冰箭術／崩裂術傷害+30%。', {
    condBonus: [
      { when: { baseLevelMin: 200 }, bonus: { magicEleDmg_water: 15, magicEleDmg_earth: 15 } },
      { when: { withCards: ['crow_baron_card'], jobLine: 'sage' }, bonus: { skillDmg_coldbolt: 30, skillDmg_heavensdrive: 30 } }
    ]
  });
  define('evil_evil_box_card', '惡靈邪惡箱卡片', { critDmgPct: 15 }, '暴擊傷害+15%；與珠寶邪惡箱卡片搭配且BaseLv.200以上時，暴擊傷害再+15%。', { condBonus: [{ when: { withCards: ['jewel_evil_box_card'], baseLevelMin: 200 }, bonus: { critDmgPct: 15 } }] });
  define('jewel_evil_box_card', '珠寶邪惡箱卡片', { flee: 30, crit: 5 }, 'FLEE+30、CRI+5；搭配狂暴邪惡箱卡片時，披肩精煉每+1，暴擊傷害+2%。', { slot: 'garment', condBonus: [{ when: { withCards: ['ancient_mimic_card'] }, bonus: { per1Refine_critDmgPct: 2 } }] });
  define('original_rgan_card', '原始蠕蟲卡片', { meleeDmgPct: 8 }, '近距離物理傷害+8%。');
  define('lower_rgan_card', '下級蠕蟲卡片', { meleeDmgPct: 8 }, '近距離物理傷害+8%；搭配原始蠕蟲卡片時，變動詠唱-8%。', {
    condBonus: [{ when: { withCards: ['original_rgan_card'] }, bonus: { variableCastPct: -8 } }]
  });
  define('abandoned_original_rgan_card', '廢棄的原始蠕蟲卡片', { magicEleDmg_shadow: 35, spCostPct: 10 }, '暗屬性魔法傷害+35%；使用技能時SP消耗量+10%。');
  define('abandoned_middle_rgan_card', '廢棄的中級蠕蟲卡片', { magicEleDmg_ghost: 35, spCostPct: 10 }, '念屬性魔法傷害+35%；使用技能時SP消耗量+10%。');

  window.__V25394_CARD_AUDIT__ = { version: 'v2.5.394', added, corrected: ['good_rabbit_card','summer_pope_card','summer_malan_card'], source };
})();
