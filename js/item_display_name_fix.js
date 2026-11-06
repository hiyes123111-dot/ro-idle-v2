/* v2.5.78: Compatibility shim; canonical global is declared in index.html head. */
if (typeof window.getItemDisplayName !== 'function') {
  window.getItemDisplayName = function (itemId) {
    if (itemId === null || itemId === undefined || itemId === '') return '未知物品';
    var db = window.ITEMS || window.items || window.ITEM_DATA || null;
    var item = (itemId && typeof itemId === 'object') ? itemId : (db ? db[itemId] : null);
    if (item && typeof item === 'object') {
      var n = item.displayName || item.display_name || item.name_zh || item.name || item.title;
      if (typeof n === 'string' && n.trim()) return n.trim();
    }
    return String(itemId);
  };
}
