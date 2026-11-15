/* v2.5.395 — 自動補齊卡片套卡圖鑑索引
 * Every card condBonus that requires withCards is surfaced in the Set Codex.
 * This does not alter the bonus evaluator or invent any card effects.
 */
(() => {
  if (typeof CARDS === 'undefined') return;
  const idToName = id => (CARDS[id] && CARDS[id].name) || id;
  let indexed = 0;
  Object.entries(CARDS).forEach(([cardId, card]) => {
    (card.condBonus || []).forEach(rule => {
      const required = Array.isArray(rule.when && rule.when.withCards) ? rule.when.withCards : [];
      if (!required.length) return;
      const members = [...new Set([cardId, ...required])].sort();
      const signature = members.join('|');
      const name = members.map(idToName).join('＋') + '套卡';
      // Stable signature lets reciprocal rules (A requires B and B requires A) group together.
      rule.setId = rule.setId || ('cardset_' + signature.replace(/[^a-zA-Z0-9_-]/g, '_'));
      rule.setName = rule.setName || name;
      indexed++;
    });
  });
  window.__V25395_CARD_SET_CODEX__ = { indexedRules: indexed };
})();
