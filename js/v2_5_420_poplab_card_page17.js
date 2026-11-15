/* v2.5.420 — POPLAB TWRO card catalog comparison, page 17 (IDs 4483–4513).
 * Apply only source-confirmed effects that have supported runtime calculation paths.
 * Leave proc/trigger and other unresolved cards unchanged.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const defs = [
    {
      id: 'sealed_queen_bee_card', imgId: 4484, name: '封印蜂后卡片',
      slot: 'headgear', bonus: { gemstoneCostFree: 100, spCostPct: 50 },
      condBonus: [{ when: { refineMin: 15 }, bonus: { spCostPct: -15 } }],
      desc: '使用技能時不消耗魔力礦石；技能SP消耗量+50%；精煉+15以上時，技能SP消耗量再-15%。頭具卡片；台灣 TWRO 道具 ID：4484。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4484.html?page=17&section=cards',
      artLabel: '免魔力礦石／SP消耗'
    },
    {
      id: 'sealed_nightmare_card', imgId: 4485, name: '封印幽暗夢魘卡片',
      slot: 'armor',
      bonus: { eleDmg_holy: 20, eleDmg_shadow: 20, raceDmg_angel: 20, raceDmg_demon: 20 },
      condBonus: [{ when: { refineMin: 15 }, bonus: { eleDmg_holy: 10, eleDmg_shadow: 10, raceDmg_angel: 10, raceDmg_demon: 10 } }],
      desc: '對聖屬性、暗屬性、天使型、惡魔型對象的物理傷害+20%；精煉+15以上時，上述傷害再+10%。鎧甲卡片；台灣 TWRO 道具 ID：4485。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4485.html?page=17&section=cards',
      artLabel: '聖／暗／天使／惡魔物傷'
    },
    {
      id: 'sealed_beelzebub_card', imgId: 4486, name: '封印貝雷傑卡片',
      slot: 'accessory', bonus: { variableCastPct: -15 },
      desc: '使用技能時，變動詠唱-15%。飾品卡片；台灣 TWRO 道具 ID：4486。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4486.html?page=17&section=cards',
      artLabel: '變動詠唱 -15%'
    },
    {
      id: 'sealed_pharaoh_card', imgId: 4489, name: '封印法老王卡片',
      slot: 'headgear', bonus: { spCostPct: -15 },
      desc: '使用技能時，SP消耗量-15%。頭具卡片；台灣 TWRO 道具 ID：4489。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4489.html?page=17&section=cards',
      artLabel: '技能 SP 消耗 -15%'
    },
    {
      id: 'sealed_orc_hero_card', imgId: 4492, name: '封印獸人英雄卡片',
      slot: 'headgear', bonus: { vit: 3, ailResist_stun: 40 },
      condBonus: [{ when: { refineMin: 15 }, bonus: { ailResist_stun: 20 } }],
      desc: 'VIT+3；暈眩抗性+40%；精煉+15以上時，暈眩抗性再+20%。頭具卡片；台灣 TWRO 道具 ID：4492。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4492.html?page=17&section=cards',
      artLabel: 'VIT +3／暈眩抗性'
    },
    {
      id: 'sealed_tao_gunka_card', imgId: 4493, name: '封印塔奧群卡卡片',
      slot: 'armor', bonus: { hpPct: 50, def: -50, mdef: -50 },
      condBonus: [{ when: { refineMin: 15 }, bonus: { hpPct: 25 } }],
      desc: 'MHP+50%、DEF-50、MDEF-50；精煉+15以上時，MHP提升為+75%，DEF與MDEF仍-50。鎧甲卡片；台灣 TWRO 道具 ID：4493。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4493.html?page=17&section=cards',
      artLabel: 'MHP +50%／DEF・MDEF -50'
    },
    {
      id: 'beetle_card', imgId: 4505, name: '甲蟲卡片',
      slot: 'accessory', bonus: { matk: 20, spPct: -1 },
      desc: 'MATK+20、MSP-1%。飾品卡片；台灣 TWRO 道具 ID：4505。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4505.html?page=17&section=cards',
      artLabel: 'MATK +20／MSP -1%'
    },
    {
      id: 'golden_beetle_card', imgId: 4508, name: '黃金甲蟲卡片',
      slot: 'accessory', bonus: { atk: 20, hpPct: -1 },
      desc: 'ATK+20、MHP-1%。飾品卡片；台灣 TWRO 道具 ID：4508。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4508.html?page=17&section=cards',
      artLabel: 'ATK +20／MHP -1%'
    },
    {
      id: 'devil_pecker_card', imgId: 4512, name: '惡魔啄木鳥卡片',
      slot: 'headgear', bonus: { healPct: 3 },
      condBonus: [{ when: { jobLine: 'acolyte' }, bonus: { per2Refine_healPct: 1 } }],
      desc: '治癒量+3%；服事系列裝備時，精煉每+2再增加治癒量+1%。頭具卡片；台灣 TWRO 道具 ID：4512。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4512.html?page=17&section=cards',
      artLabel: '治癒量 +3%／服事精煉成長'
    },
    {
      id: 'crazy_mantis_card', imgId: 4513, name: '瘋狂螳螂卡片',
      slot: 'headgear', bonus: { critDmgPct: 2 },
      condBonus: [{ when: { jobLine: 'thief' }, bonus: { per2Refine_critDmgPct: 1 } }],
      desc: '暴擊傷害+2%；盜賊系列裝備時，精煉每+2再增加暴擊傷害+1%。頭具卡片；台灣 TWRO 道具 ID：4513。POPLAB 尚無取得資訊。',
      source: 'https://rodb.poplab.tw/twro/item/4513.html?page=17&section=cards',
      artLabel: '暴擊傷害 +2%／盜賊精煉成長'
    }
  ];
  const slotName = { weapon: '武器', headgear: '頭具', armor: '鎧甲', shield: '盾牌', garment: '披肩', footgear: '鞋子', accessory: '飾品' };
  window.CARD_ART_FALLBACKS = window.CARD_ART_FALLBACKS || {};
  for (const d of defs) {
    CARDS[d.id] = {
      ...(CARDS[d.id] || {}),
      id: d.id, monsterId: null, name: d.name, icon: '🃏',
      slot: d.slot, bonus: d.bonus,
      ...(d.condBonus ? { condBonus: d.condBonus } : {}),
      source: d.source, desc: d.desc, addedVersion: 'v2.5.420'
    };
    ITEMS[d.id] = {
      ...(ITEMS[d.id] || {}),
      id: d.id, imgId: d.imgId, name: d.name, type: 'material',
      icon: '🃏', weight: 1, sell: 10, buyPrice: 20, codexInclude: true,
      addedVersion: ITEMS[d.id]?.addedVersion || 'v2.5.420',
      desc: `${d.desc} 系列：卡片；裝備：${slotName[d.slot]}；官方道具 ID：${d.imgId}；取得來源以卡片資料說明為準。`
    };
    window.CARD_ART_FALLBACKS[d.id] = `images/cards/generated/${d.id}.svg`;
  }

  // These records contain proc mechanics or incomplete source/runtime alignment and
  // are intentionally left untouched in this comparison batch.
  window.__V25420_POPLAB_CARD_PAGE17__ = {
    added: defs.map(d => ({ id: d.id, imgId: d.imgId })),
    correctedExisting: [],
    alreadyCorrect: [{ id: 'sealed_apocalips_h_card', imgId: 4503 }, { id: 'dolomedes_card', imgId: 4506 }],
    intentionallySkipped: [
      { imgId: 4483, reason: '封印德古拉伯爵卡片的SP吸收觸發效果待戰鬥機制核對。' },
      { imgId: 4487, reason: '封印伊夫利特卡片含JOB等級動態加成及受擊觸發，先保留待核對。' },
      { imgId: 4488, reason: '封印黑暗之王卡片含受擊自動詠唱及套卡效果，先保留待核對。' },
      { imgId: 4490, reason: '封印月夜貓卡片的精煉門檻技能賦予需新增卡片限定 grantSkillWhen 支援。' },
      { imgId: 4491, reason: '封印闇●神射手迪文卡片的HP吸收觸發與HP恢復率-100%需專用處理。' },
      { imgId: 4494, reason: '封印烏龜將軍卡片含攻擊自動詠唱，觸發機率未列。' },
      { imgId: 4495, reason: '封印古埃及王卡片含受擊自動詠唱，觸發機率未列。' },
      { imgId: 4497, reason: '封印冰暴騎士卡片含攻擊自動詠唱與冰凍觸發，機率未列。' },
      { imgId: 4498, reason: '封印嗒妮小姐卡片含捕捉掉落香蕉效果，先不部分套用。' },
      { imgId: 4499, reason: '封印元靈武士卡片含一般階級防禦無視與週期扣HP，需專用處理。' },
      { imgId: 4500, reason: '封印獸人酋長卡片含近距離物理反射與精煉成長，需先核對反射引擎。' },
      { imgId: 4501, reason: '封印闇●神官瑪嘉雷特卡片含受擊自動詠唱，機率未列。' },
      { imgId: 4502, reason: '封印闇●神工匠哈沃得卡片含破壞裝備觸發，需專用耐久度系統。' },
      { imgId: 4504, reason: '封印虎王卡片含無限霸體效果，需確認擊退免疫管線。' },
      { imgId: 4509, reason: '黃金女王甲蟲卡片「對昆蟲型對象的傷害-10%」方向未明確，先不猜測是增傷或承傷減少。' },
      { imgId: 4507, reason: '女王甲蟲卡片現有對指定魔物增傷與來源的甲蟲系列分類需再核對，且掉落召喚書機率未列。' },
      { imgId: 4510, reason: '異形毛毛怪卡片的近距離攻擊沉睡機率未列，既有資料不覆寫。' },
      { imgId: 4511, reason: '玩偶魔妖卡片的魔法攻擊沉默機率未列，既有資料不覆寫。' }
    ]
  };
})();
