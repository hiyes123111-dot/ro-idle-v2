/* 諸神放置錄 v2.5.479
 * Versioned runtime cache. New releases never reuse an older runtime cache.
 * Navigation + JS/CSS are network-first; localStorage/player saves are untouched.
 */
'use strict';

var GAME_CACHE = 'ro-idle-runtime-v2.5.479';
var GAME_CACHE_PREFIX = 'ro-idle-runtime-';

self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    var names = await caches.keys();
    await Promise.all(names.filter(function (name) {
      return name.indexOf(GAME_CACHE_PREFIX) === 0 && name !== GAME_CACHE;
    }).map(function (name) { return caches.delete(name); }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (!request || request.method !== 'GET') return;

  var url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  var isNavigation = request.mode === 'navigate';
  var isScriptOrStyle = /\.(?:js|css)$/i.test(url.pathname);
  if (!isNavigation && !isScriptOrStyle) return;

  event.respondWith((async function () {
    var cache = await caches.open(GAME_CACHE);
    try {
      var fresh = await fetch(request, { cache: 'no-store' });
      if (fresh && fresh.ok && fresh.type === 'basic') {
        try { await cache.put(request, fresh.clone()); } catch (cacheError) {
          /* Cache quota must not block gameplay or saving. */
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
