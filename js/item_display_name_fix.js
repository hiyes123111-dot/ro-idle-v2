/* v2.5.85: Compatibility shim for every item UI.
   Prefer the global lexical ITEMS declared by data.js; `const ITEMS`
   does not create window.ITEMS. */
(function () {
  function resolveItemName(itemId) {
    if (itemId === null || itemId === undefined || itemId === '') return '未知物品';
    var db = (typeof ITEMS !== 'undefined' && ITEMS) ? ITEMS :
             (window.ITEMS || window.items || window.ITEM_DATA || null);
    var item = (itemId && typeof itemId === 'object') ? itemId : (db ? db[itemId] : null);
    var name = item && (item.displayName || item.display_name || item.name_zh || item.name || item.title);
    if (typeof name === 'string' && name.trim()) return name.trim();
    if (db) {
      var key = String(itemId);
      var keys = Object.keys(db);
      for (var i = 0; i < keys.length; i++) {
        var row = db[keys[i]];
        if ((keys[i] === key || (row && String(row.id) === key)) && row) {
          name = row.displayName || row.display_name || row.name_zh || row.name || row.title;
          if (typeof name === 'string' && name.trim()) return name.trim();
        }
      }
    }
    return String(itemId);
  }
  window.getItemDisplayName = resolveItemName;
  window.getitemDisplayName = resolveItemName;
})();
