/* v2.5.397 — 擴充卡片搭配套裝圖鑑索引
 * Index card rules that require other cards OR equipment. This is metadata/UI only;
 * the combat condition evaluator and numeric bonuses remain unchanged.
 */
(() => {
  if (typeof CARDS === 'undefined') return;
  const nameOf = id => (CARDS[id] || ITEMS[id] || {}).name || id;
  const uniqueGroups = groups => {
    const seen = new Set();
    return groups.filter(group => {
      const clean = [...new Set((group || []).filter(Boolean))];
      if (!clean.length) return false;
      const key = clean.slice().sort().join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(group => [...new Set(group.filter(Boolean))]);
  };
  let indexedRules = 0;
  let cardOnlyRules = 0;
  let cardItemRules = 0;
  const missingMembers = [];
  Object.entries(CARDS).forEach(([cardId, card]) => {
    (card.condBonus || []).forEach(rule => {
      const when = rule.when || {};
      const hasCards = Array.isArray(when.withCards) && when.withCards.length > 0;
      const hasItems = Array.isArray(when.withItems) && when.withItems.length > 0;
      const hasAnyItems = Array.isArray(when.withAnyItem) && when.withAnyItem.length > 0;
      const hasItemGroups = Array.isArray(when.withItemGroups) && when.withItemGroups.some(g => Array.isArray(g) && g.length);
      if (!(hasCards || hasItems || hasAnyItems || hasItemGroups)) return;
      const requiredGroups = [[cardId]];
      if (hasCards) when.withCards.forEach(id => requiredGroups.push([id]));
      if (hasItems) when.withItems.forEach(id => requiredGroups.push([id]));
      if (hasAnyItems) requiredGroups.push(when.withAnyItem);
      if (hasItemGroups) when.withItemGroups.forEach(group => requiredGroups.push(group));
      const pieces = uniqueGroups(requiredGroups);
      const allMembers = [...new Set(pieces.flat())].sort();
      allMembers.forEach(id => { if (!(CARDS[id] || (typeof ITEMS !== 'undefined' && ITEMS[id]))) missingMembers.push(`${cardId}:${id}`); });
      const signature = pieces.map(g => g.slice().sort().join('|')).sort().join('::');
      const safe = signature.replace(/[^a-zA-Z0-9_-]/g, '_');
      rule.setId = rule.setId || `cardcombo_${safe}`;
      rule.setName = rule.setName || `${allMembers.map(nameOf).join('＋')}搭配套裝`;
      rule.setPieces = rule.setPieces || pieces;
      indexedRules++;
      if (hasCards && !hasItems && !hasAnyItems && !hasItemGroups) cardOnlyRules++;
      else cardItemRules++;
    });
  });
  window.__V25396_CARD_SET_CODEX__ = { version: 'v2.5.397', indexedRules, cardOnlyRules, cardItemRules, missingMembers };
})();
