/* v2.5.76 — 全域裝備名稱解析修復
   明確掛到 window，避免不同載入環境下函式未成為全域屬性。 */
(function (root) {
  'use strict';
  function getItemDisplayName(itemId) {
    if (itemId === null || itemId === undefined || itemId === '') return '未知物品';
    var items = (typeof root.ITEMS !== 'undefined' && root.ITEMS) ? root.ITEMS :
      ((typeof ITEMS !== 'undefined' && ITEMS) ? ITEMS : null);
    var item = (typeof itemId === 'object') ? itemId : (items ? items[itemId] : null);
    function nameOf(def) {
      if (!def || typeof def !== 'object') return '';
      var name = def.displayName || def.display_name || def.name_zh || def.name || def.title;
      return (typeof name === 'string' && name.trim()) ? name.trim() : '';
    }
    var direct = nameOf(item);
    if (direct) return direct;
    if (items) {
      var key = String(itemId);
      if (Object.prototype.hasOwnProperty.call(items, key)) {
        direct = nameOf(items[key]);
        if (direct) return direct;
      }
      var keys = Object.keys(items);
      for (var i = 0; i < keys.length; i++) {
        var def = items[keys[i]];
        if (def && String(def.id) === key) {
          direct = nameOf(def);
          if (direct) return direct;
        }
      }
    }
    return String(itemId);
  }
  root.getItemDisplayName = getItemDisplayName;
  // Classic-script lexical/global fallback and test visibility.
  if (typeof window !== 'undefined') window.getItemDisplayName = getItemDisplayName;
})(typeof window !== 'undefined' ? window : globalThis);
