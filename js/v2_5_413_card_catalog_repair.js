/* v2.5.413 — TWRO official card catalog gap repair
 * Source: POPLAB RO TWRO item 4059 (Taiwan client data).
 * No monster drop source is supplied by the source page; do not invent one.
 */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const id = 'ant_soldier_card';
  if (!CARDS[id]) {
    CARDS[id] = {
      id,
      monsterId: null,
      name: '戰蟻卡片',
      icon: '🛡️',
      slot: 'shield',
      bonus: { raceDmgReduce_plant: 30 },
      desc: '受到植物型對象攻擊時，傷害減少 30%。盾牌卡片；台灣 TWRO 道具 ID：4059。官方資料庫尚無取得資訊，未虛構怪物掉落來源。'
    };
  }
  if (!ITEMS[id]) {
    ITEMS[id] = {
      id,
      imgId: 4059,
      name: '戰蟻卡片',
      type: 'material',
      icon: '🛡️',
      weight: 1,
      sell: 10,
      buyPrice: 20,
      codexInclude: true,
      addedVersion: 'v2.5.413',
      desc: '受到植物型對象攻擊時，傷害減少 30%。系列：卡片；裝備：盾牌；台灣 TWRO 道具 ID：4059。取得來源尚待官方資料補充。'
    };
  } else {
    ITEMS[id].imgId = 4059;
    ITEMS[id].codexInclude = true;
    ITEMS[id].addedVersion = ITEMS[id].addedVersion || 'v2.5.413';
  }
  window.CARD_ART_FALLBACKS = window.CARD_ART_FALLBACKS || {};
  // Source page exposes the card art remotely but this build does not contain that binary.
  // Use the explicit in-game placeholder until the real asset can be bundled.
  window.CARD_ART_FALLBACKS[id] = 'images/_placeholder_card.svg';
  window.__V25413_CARD_CATALOG_REPAIR__ = { added: id, officialItemId: 4059, sourceVerified: true, artPlaceholder: true };
})();
