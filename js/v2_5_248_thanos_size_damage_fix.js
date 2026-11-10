/* v2.5.248：塔諾斯 AD 武器「全體型物理傷害」欄位校正。
   原始資料同時填入 sizeDmg_small/medium/large 與 allTargetDmgPct，
   會造成傷害重複加成，且 allTargetDmgPct 還會誤影響魔法傷害。
   依描述改為體型專用欄位；另將近距離物理傷害獨立放入 meleeDmgPct。
*/
(function () {
  if (typeof ITEMS === 'undefined') return;
  const fixes = {
    thanos_spear_ad: { melee: 15 },
    thanos_katar_ad: { melee: 15 },
    thanos_knuckle_ad: { melee: 15 },
    thanos_tsword_ad: { melee: 15 },
    thanos_axe_ad: { melee: 15 },
    thanos_hammer_ad: { melee: 15, magicSizes: 15 }
  };
  const patched = [];
  for (const [id, cfg] of Object.entries(fixes)) {
    const item = ITEMS[id];
    if (!item) continue;
    let changed = false;
    (item.condBonus || []).forEach(rule => {
      if (!rule || !rule.when || Number(rule.when.refineMin) !== 11 || !rule.bonus) return;
      const b = rule.bonus;
      const hasAllSizes = ['small', 'medium', 'large'].every(s => Number(b['sizeDmg_' + s]) === 15);
      if (!hasAllSizes || Number(b.allTargetDmgPct) !== 15) return;
      delete b.allTargetDmgPct;
      b.meleeDmgPct = cfg.melee;
      if (cfg.magicSizes) {
        for (const size of ['small', 'medium', 'large']) b['magicSizeDmg_' + size] = cfg.magicSizes;
      }
      changed = true;
    });
    if (changed) patched.push(id);
  }
  window.V2548_THANOS_SIZE_DAMAGE_AUDIT = {
    patched,
    excluded: ['ac_b44_ad'],
    expectedCount: 6,
    allTargetDuplicateRemoved: true,
    hammerMagicSizeSeparated: true
  };
})();
