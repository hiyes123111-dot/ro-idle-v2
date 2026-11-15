/* v2.5.428 — 22週年紀念(雙重)卡片
 * 台灣官方資料：ID 313524；官方定位為服飾披肩附魔。
 * 本作目前沒有獨立的服飾披肩附魔欄，暫以披肩卡片槽承載，讓三項增傷可實際運作。
 * 來源效果：近/遠距離物理傷害 +11%，全屬性魔法傷害 +11%。
 */
(() => {
  const id = 'anniversary_22_double_card';
  if (typeof ITEMS === 'undefined' || typeof CARDS === 'undefined') return;
  ITEMS[id] = {
    id,
    imgId: 313524,
    name: '22週年紀念(雙重)',
    type: 'material',
    icon: '🃏',
    weight: 1,
    sell: 1,
    slots: 0,
    desc: '近距離物理傷害+11%、遠距離物理傷害+11%、全屬性魔法傷害+11%。系列：卡片；官方部位：服飾披肩附魔。本作暫以披肩卡片槽套用（目前尚無獨立服飾附魔欄）。道具 ID：313524。',
    addedVersion: 'v2.5.428'
  };
  CARDS[id] = {
    id,
    monsterId: null,
    name: '22週年紀念(雙重)',
    icon: '🃏',
    slot: 'garment',
    bonus: {
      meleeDmgPct: 11,
      rangedDmgPct: 11,
      allEleDmg: 11
    },
    desc: '近距離物理傷害+11%、遠距離物理傷害+11%、全屬性魔法傷害+11%。官方定位為服飾披肩附魔；本作暫以披肩卡片槽套用，待建立獨立服飾附魔欄後再調整。',
    ep: 'Anniversary',
    addedVersion: 'v2.5.428'
  };
})();
