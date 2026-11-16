/* 諸神放置錄 v2.5.441
 * Navigation + JS/CSS: network-first, so online clients do not stay on stale game code.
 * Other requests are left to the browser. LocalStorage is never read, modified or cleared.
 */
'use strict';

var GAME_CACHE = 'ro-idle-runtime-v1';

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (!request || request.method !== 'GET') return;

  var url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin) return;

  var isNavigation = request.mode === 'navigate';
  var isScriptOrStyle = /\.(?:js|css)$/i.test(url.pathname);
  if (!isNavigation && !isScriptOrStyle) return;

  event.respondWith((async function () {
    var cache = await caches.open(GAME_CACHE);
    try {
      /* 明確略過 HTTP 快取，避免 Chrome 回傳舊版 HTML/JS/CSS。 */
      var fresh = await fetch(request, { cache: 'no-store' });
      if (fresh && fresh.ok && fresh.type === 'basic') {
        try {
          await cache.put(request, fresh.clone());
        } catch (cacheError) {
          /* 快取空間不足不應阻擋正常載入。 */
        }
      }
      return fresh;
    } catch (networkError) {
      var fallback = await cache.match(request);
      if (fallback) return fallback;
      throw networkError;
    }
  })());
});
