/* v2.5.85: Compatibility shim for every item UI.
   Prefer the global lexical ITEMS declared by data.js; `const ITEMS`
   does not create window.ITEMS. */
(function () {
  /* 只有直接 ID 查找失敗時才會走舊資料相容掃描；掃描可能遍歷整份大型 ITEMS。
     將最近 512 個 fallback 結果暫存，避免同一個舊 ID 在每次 render 重掃資料庫。 */
  var FALLBACK_CACHE_LIMIT = 512;
  var fallbackNameCache = new Map();
  function rememberFallbackName(key, value) {
    if (fallbackNameCache.has(key)) fallbackNameCache.delete(key);
    if (fallbackNameCache.size >= FALLBACK_CACHE_LIMIT) {
      fallbackNameCache.delete(fallbackNameCache.keys().next().value);
    }
    fallbackNameCache.set(key, value);
    return value;
  }
  function resolveItemName(itemId) {
    if (itemId === null || itemId === undefined || itemId === '') return '未知物品';
    var db = (typeof ITEMS !== 'undefined' && ITEMS) ? ITEMS :
             (window.ITEMS || window.items || window.ITEM_DATA || null);
    var cardDb = (typeof CARDS !== 'undefined' && CARDS) ? CARDS : (window.CARDS || null);
    var item = (itemId && typeof itemId === 'object') ? itemId : (db ? db[itemId] : null);
    if (!item && cardDb) item = cardDb[itemId];
    var name = item && (item.displayName || item.display_name || item.name_zh || item.name || item.title);
    if (typeof name === 'string' && name.trim()) return name.trim();
    if (db) {
      var key = String(itemId);
      if (fallbackNameCache.has(key)) {
        var cachedName = fallbackNameCache.get(key);
        fallbackNameCache.delete(key);
        fallbackNameCache.set(key, cachedName);
        return cachedName;
      }
      var keys = Object.keys(db);
      for (var i = 0; i < keys.length; i++) {
        var row = db[keys[i]];
        if ((keys[i] === key || (row && String(row.id) === key)) && row) {
          name = row.displayName || row.display_name || row.name_zh || row.name || row.title;
          if (typeof name === 'string' && name.trim()) {
            return rememberFallbackName(key, name.trim());
          }
        }
      }
      return String(itemId);
    }
    return String(itemId);
  }
  window.getItemDisplayName = resolveItemName;
  window.getitemDisplayName = resolveItemName;
})();
