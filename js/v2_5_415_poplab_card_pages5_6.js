/* v2.5.415 — POPLAB TWRO card catalog comparison, page 5
 * Sources: POPLAB TWRO cards page 5 and item details 4130 / 4145.
 * Both detail pages currently report no acquisition information; do not invent drops.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const defs = [
    {
      id: 'scorpion_king_card',
      imgId: 4130,
      name: '蠍子之王卡片',
      slot: 'weapon',
      bonus: { raceDmg_undead: 20 },
      desc: '對不死型對象的傷害+20%。武器卡片；台灣 TWRO 道具 ID：4130。POPLAB 尚無取得資訊，未虛構怪物掉落來源。',
      source: 'https://rodb.poplab.tw/twro/item/4130.html?page=5&section=cards',
      artLabel: '不死增傷'
    },
    {
      id: 'beelzebub_card',
      imgId: 4145,
      name: '貝雷傑卡片',
      slot: 'accessory',
      bonus: { variableCastPct: -30 },
      desc: '使用技能時，變動詠唱-30%。飾品卡片；台灣 TWRO 道具 ID：4145。POPLAB 尚無取得資訊，未虛構怪物掉落來源。',
      source: 'https://rodb.poplab.tw/twro/item/4145.html?page=5&section=cards',
      artLabel: '變動詠唱'
    },
    {
      id: 'burning_savage_bear_card',
      imgId: 4162,
      name: '暴燄野熊卡片',
      slot: 'armor',
      bonus: {},
      unimplemented: ['受到物理傷害時，有機率使攻擊者陷入黑暗；搭配大腳熊卡片時觸發機率提高。POPLAB 未提供觸發機率，尚未接入戰鬥觸發。'],
      desc: '受到物理傷害時，有機率使攻擊者陷入黑暗；搭配大腳熊卡片時觸發機率提高。觸發機率尚未由來源提供，效果暫列待實裝。鎧甲卡片；台灣 TWRO 道具 ID：4162。',
      source: 'https://rodb.poplab.tw/twro/item/4162.html?page=6&section=cards',
      artLabel: '物理受擊黑暗（待實裝）'
    },
    {
      id: 'deviling_card',
      imgId: 4174,
      name: '惡魔波利卡片',
      slot: 'garment',
      bonus: {
        eleReduce_none: 50,
        eleReduce_water: -50,
        eleReduce_earth: -50,
        eleReduce_fire: -50,
        eleReduce_wind: -50,
        eleReduce_poison: -50,
        eleReduce_holy: -50,
        eleReduce_shadow: -50,
        eleReduce_ghost: -50,
        eleReduce_undead: -50
      },
      desc: '受到無屬性攻擊的抗性+50%；受到水、地、火、風、毒、聖、暗、念、不死屬性攻擊的抗性-50%。披肩卡片；台灣 TWRO 道具 ID：4174。',
      source: 'https://rodb.poplab.tw/twro/item/4174.html?page=6&section=cards',
      artLabel: '無屬性抗性'
    }
  ];
  const slotName = { weapon: '武器', accessory: '飾品', armor: '鎧甲', garment: '披肩' };
  window.CARD_ART_FALLBACKS = window.CARD_ART_FALLBACKS || {};
  for (const d of defs) {
    CARDS[d.id] = {
      ...(CARDS[d.id] || {}),
      id: d.id,
      monsterId: null,
      name: d.name,
      icon: '🃏',
      slot: d.slot,
      bonus: d.bonus,
      ...(d.unimplemented ? { unimplemented: d.unimplemented } : {}),
      source: d.source,
      desc: d.desc,
      addedVersion: 'v2.5.415'
    };
    ITEMS[d.id] = {
      ...(ITEMS[d.id] || {}),
      id: d.id,
      imgId: d.imgId,
      name: d.name,
      type: 'material',
      icon: '🃏',
      weight: 1,
      sell: 10,
      buyPrice: 20,
      codexInclude: true,
      addedVersion: ITEMS[d.id]?.addedVersion || 'v2.5.415',
      desc: `${d.desc} 系列：卡片；裝備：${slotName[d.slot]}；官方道具 ID：${d.imgId}；取得來源尚待補充。`
    };
    window.CARD_ART_FALLBACKS[d.id] = `images/cards/generated/${d.id}.svg`;
  }
  window.__V25415_POPLAB_CARD_PAGE5__ = {
    added: defs.map(d => d.id),
    officialItemIds: defs.map(d => d.imgId),
    sourceVerified: true,
    acquisitionSourceKnown: false,
    page6Unimplemented: ['burning_savage_bear_card'],
    excludedPending: [
      '暗黑祭司','妖道','拉鏈熊','將軍魔碑','RSX-0806',
      '消防魔','三頭龍','迪塔勒泰晤勒斯','蘭特克力斯','石頭波利'
    ]
  };
})();
