/* v2.5.452 — card catalog search-name repair. */
(() => {
  if (typeof CARDS === 'undefined' || typeof ITEMS === 'undefined') return;
  const id = 'corroded_dimik_card';
  const card = CARDS[id];
  const item = ITEMS[id];
  if (card && item) {
    const aliases = ['被侵蝕的迪摩克卡片','被侵蝕的迪靡克卡片','被侵蝕迪摩克','被侵蝕迪靡克','300646'];
    card.searchTerms = [...new Set([...(card.searchTerms || []), ...aliases])].join(' ');
    item.searchTerms = [...new Set([...(item.searchTerms || []), ...aliases])].join(' ');
  }
  if (typeof invalidateCodexPoolCache === 'function') invalidateCodexPoolCache();
  window.__V25452_CARD_CATALOG_REPAIR__ = {cardId:id, searchAliases:5, registered:!!(card && item)};
})();
