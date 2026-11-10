/* v2.5.247：150 等以上武器附加能力批次補齊（排除 AC-B44-OS-AD）
   僅補上現有引擎已支援的能力欄位；不把尚無戰鬥機制的不可破壞、觸發型詞條假裝實裝。 */
(function () {
  if (typeof ITEMS === 'undefined') return;
  const addBonus = (id, bonus) => {
    const item = ITEMS[id];
    if (!item) return;
    item.bonus = Object.assign({}, item.bonus || {}, bonus || {});
  };
  const addCond = (id, when, bonus) => {
    const item = ITEMS[id];
    if (!item) return;
    item.condBonus = (item.condBonus || []).concat([{ when, bonus }]);
  };

  // 邪念武器：官方描述明確為精煉平方，最多計算至 +15。
  ['sinister_spear', 'sinister_lance', 'sinister_revolver', 'sinister_katar'].forEach(id => {
    const item = ITEMS[id];
    if (!item) return;
    item.perRefineCap = 15;
    item.perRefineSquare = Object.assign({}, item.perRefineSquare || {}, { atk: 1 });
  });
  if (ITEMS.sinister_wire) {
    ITEMS.sinister_wire.perRefineCap = 15;
    ITEMS.sinister_wire.perRefineSquare = Object.assign({}, ITEMS.sinister_wire.perRefineSquare || {}, { atk: 1 });
    ITEMS.sinister_wire.perRefineSquareMatkHalf = Object.assign({}, ITEMS.sinister_wire.perRefineSquareMatkHalf || {}, { matk: 1 });
  }
  if (ITEMS.sinister_book) {
    ITEMS.sinister_book.perRefineCap = 15;
    ITEMS.sinister_book.perRefineSquare = Object.assign({}, ITEMS.sinister_book.perRefineSquare || {}, { atk: 1, matk: 1 });
  }

  // 瑞爾雙手劍：除每 +2 階級傷害外，還有每精煉 +1 的攻擊後延遲減少。
  if (ITEMS.two_hand_spear_170) {
    ITEMS.two_hand_spear_170.per1Refine = Object.assign({}, ITEMS.two_hand_spear_170.per1Refine || {}, { aspdPct: 1 });
  }
  // 王室騎士巨劍：精煉 +7 暴擊傷害 +10%；每 +2 ATK +20 原資料保留。
  addCond('t_sword_of_kingdom', { refineMin: 7 }, { critDmgPct: 10 });

  // 170 等級樂器：MATK、無屬性魔法傷害與精煉成長；技能本體存在才接入技能增傷。
  ['heart_whip', 'black_circle'].forEach(id => {
    const item = ITEMS[id];
    if (!item) return;
    if (item.matk == null) item.matk = 190;
    addBonus(id, { eleDmg_none: 10 });
    item.per1Refine = Object.assign({}, item.per1Refine || {}, { matk: 4 });
    addCond(id, { refineMin: 9 }, { skillDmg_mi_soundblend: 30 });
    addCond(id, { refineMin: 11 }, { skillCdFlat_mi_soundblend: -2 });
  });

  // 艾音貝赫魔杖與探測器：補齊描述中可由現有屬性傷害、MATK、攻速系統直接處理的欄位。
  if (ITEMS.ein_1hwand) {
    ITEMS.ein_1hwand.matk = ITEMS.ein_1hwand.matk || 200;
    addBonus('ein_1hwand', { eleDmg_none: 7, eleDmg_water: 7, eleDmg_fire: 7 });
    addCond('ein_1hwand', { refineMin: 7 }, { matk: 40 });
    addCond('ein_1hwand', { refineMin: 9 }, { eleDmg_none: 8, eleDmg_water: 8, eleDmg_fire: 8 });
  }
  if (ITEMS.ein_1hmagger) {
    ITEMS.ein_1hmagger.matk = ITEMS.ein_1hmagger.matk || 180;
    addBonus('ein_1hmagger', { matkPct: 10, eleDmg_fire: 7, eleDmg_none: 7 });
    addCond('ein_1hmagger', { refineMin: 7 }, { matk: 40, aspdPct: 10 });
    addCond('ein_1hmagger', { refineMin: 9 }, { eleDmg_fire: 8, eleDmg_none: 8 });
  }
  if (ITEMS.ein_bhstaff) {
    ITEMS.ein_bhstaff.matk = ITEMS.ein_bhstaff.matk || 330;
    addBonus('ein_bhstaff', { matkPct: 10 });
    addCond('ein_bhstaff', { refineMin: 7 }, { matk: 60 });
    addCond('ein_bhstaff', { refineMin: 9 }, { eleDmg_fire: 15 });
  }

  window.V2547_WEAPON_BATCH_AUDIT = {
    excluded: ['mh_p89_ad'],
    patched: ['sinister_spear','sinister_lance','sinister_wire','sinister_revolver','sinister_katar','sinister_book','two_hand_spear_170','t_sword_of_kingdom','heart_whip','black_circle','ein_1hwand','ein_1hmagger','ein_bhstaff'],
    squareRefineCap: 15,
    auditOnly: true
  };
})();
