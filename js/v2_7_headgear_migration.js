/* V2.5.5.71 — headgear refine data corrections (round 15).
 * Only explicit numeric, directly supported effects are migrated here.
 * Cast-time / after-attack delay / after-skill delay and probability procs
 * are intentionally not converted into unrelated stats.
 */
(function () {
  if (typeof ITEMS === 'undefined') return;
  const addCond = (id, rule) => {
    const item = ITEMS[id];
    if (!item) return false;
    if (!Array.isArray(item.condBonus)) item.condBonus = [];
    const signature = JSON.stringify(rule);
    if (!item.condBonus.some(x => JSON.stringify(x) === signature)) item.condBonus.push(rule);
    return true;
  };
  const setPer1 = (id, bonus, start, cap) => {
    const item = ITEMS[id];
    if (!item) return false;
    item.per1Refine = Object.assign({}, item.per1Refine || {}, bonus);
    if (start != null) item.per1RefineStart = start;
    if (cap != null) item.perRefineCap = cap;
    return true;
  };
  const audit = [];

  // 精煉+10時，全能力值再+1。
  audit.push({ id: 'carnation_garlands', done: addCond('carnation_garlands', {
    when: { refineMin: 10 }, bonus: { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 }
  }) });

  // 射手座王冠：精煉+7時遠距離物理傷害+3%；排除攻擊後延遲詞條。
  audit.push({ id: 'sagittarius_crown', done: addCond('sagittarius_crown', {
    when: { refineMin: 7 }, bonus: { rangedDmgPct: 3 }
  }) });

  // 射手座寶冠：精煉+9時MATK+3%。
  audit.push({ id: 'sagittarius_diadem', done: addCond('sagittarius_diadem', {
    when: { refineMin: 9 }, bonus: { matkPct: 3 }
  }) });

  // 蔚藍天空：精煉+5以上後，依超過+5的精煉值增加LUK。
  audit.push({ id: 'celestial_hat', done: setPer1('celestial_hat', { luk: 1 }, 6) });

  // 小飛龍頭飾：精煉+12以上，每提高+1 VIT+1，最多+5。
  audit.push({ id: 'little_wyverns', done: setPer1('little_wyverns', { vit: 1 }, 13, 17) });

  // 天地樹哈羅德王冠：精煉+8開始，每提高+1，MHP+1%。
  // 素質詠唱縮短目前沒有可安全對應的裝備加成欄位，因此不轉成其他效果。
  audit.push({ id: 'yggdrasil_herald_crown', done: setPer1('yggdrasil_herald_crown', { hpPct: 1 }, 8) });

  // 探險羽帽：基礎暴擊傷害+10%；精煉+7以上追加+5%。
  audit.push({ id: 'little_fhat', done: (function () {
    const item = ITEMS.little_fhat;
    if (!item) return false;
    item.critDmgPct = 10;
    return addCond('little_fhat', { when: { refineMin: 7 }, bonus: { critDmgPct: 5 } });
  })() });

  window.V2570_HEADGEAR_MIGRATION_AUDIT = {
    version: '2.5.5.71',
    applied: audit.filter(x => x.done).map(x => x.id),
    missing: audit.filter(x => !x.done).map(x => x.id)
  };
})();
