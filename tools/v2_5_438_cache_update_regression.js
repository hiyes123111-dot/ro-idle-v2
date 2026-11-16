const fs = require('fs');
const assert = require('assert');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const version = fs.readFileSync('VERSION.txt', 'utf8').trim();

assert.strictEqual(version, '2.5.438', 'release version');
const refs = [...html.matchAll(/[?&]v=(2\.5\.\d+)/g)].map(m => m[1]);
assert(refs.length >= 50, 'expected versioned JS/CSS references');
assert(refs.every(v => v === version), 'all HTML cache-busting refs must match release version');
assert(html.includes("navigator.serviceWorker.register('./sw.js?v=2.5.438'"), 'service worker registration');
assert(html.includes("updateViaCache: 'none'"), 'service worker update must bypass script HTTP cache');
assert(html.includes('registration.update()'), 'check for SW update at launch');
assert(html.includes('請先手動儲存，再重新整理'), 'update notice asks for safe manual refresh');
assert(sw.includes("var GAME_CACHE = 'ro-idle-runtime-v1'"), 'stable runtime cache');
assert(sw.includes("fetch(request, { cache: 'no-store' })"), 'network-first fetch bypasses HTTP cache');
assert(sw.includes("request.mode === 'navigate'"), 'navigation network-first');
assert(sw.includes('/\\.(?:js|css)$/i.test(url.pathname)'), 'JS/CSS network-first');
assert(sw.includes('cache.match(request)'), 'offline fallback');
const registrationBlock = html.slice(html.indexOf('/* v2.5.438：'), html.indexOf('</script>', html.indexOf('/* v2.5.438：')));
assert(!/localStorage|indexedDB|caches\.delete|location\.reload/.test(sw + registrationBlock), 'update mechanism must not clear player data/cache or force reload');
console.log(`PASS release version ${version}`);
console.log(`PASS ${refs.length} versioned asset references`);
console.log('PASS service worker registration and update check');
console.log('PASS network-first navigation + JS/CSS with offline fallback');
console.log('PASS no LocalStorage clearing and no forced reload');
console.log('5/5 static checks passed');

(async function testFetchBehavior() {
  const handlers = {};
  const stored = new Map();
  let networkMode = 'online';
  let fetchOptions = null;
  const cache = {
    async put(request, response) { stored.set(request.url, response); },
    async match(request) { return stored.get(request.url) || null; }
  };
  const sandbox = {
    URL,
    self: {
      location: { origin: 'https://game.example' },
      addEventListener(name, fn) { handlers[name] = fn; },
      skipWaiting() { return Promise.resolve(); },
      clients: { claim() { return Promise.resolve(); } }
    },
    caches: { async open() { return cache; } },
    async fetch(request, options) {
      fetchOptions = options;
      if (networkMode === 'offline') throw new Error('offline');
      return { ok: true, type: 'basic', marker: 'fresh-response', clone() { return this; } };
    }
  };
  vm.runInNewContext(sw, sandbox);
  let responsePromise;
  handlers.fetch({
    request: { method: 'GET', url: 'https://game.example/js/app.js?v=2.5.438', mode: 'cors' },
    respondWith(promise) { responsePromise = promise; }
  });
  const fresh = await responsePromise;
  assert.strictEqual(fresh.marker, 'fresh-response');
  assert.strictEqual(fetchOptions.cache, 'no-store');
  assert(stored.has('https://game.example/js/app.js?v=2.5.438'));

  networkMode = 'offline';
  handlers.fetch({
    request: { method: 'GET', url: 'https://game.example/js/app.js?v=2.5.438', mode: 'cors' },
    respondWith(promise) { responsePromise = promise; }
  });
  const fallback = await responsePromise;
  assert.strictEqual(fallback.marker, 'fresh-response');

  let intercepted = false;
  handlers.fetch({
    request: { method: 'GET', url: 'https://game.example/images/hero.png', mode: 'cors' },
    respondWith() { intercepted = true; }
  });
  assert.strictEqual(intercepted, false, 'image requests remain outside the runtime cache strategy');
  console.log('PASS network-first fetch updates runtime cache');
  console.log('PASS offline request falls back to cached same-URL response');
  console.log('PASS image requests are not intercepted');
  console.log('8/8 passed');
})().catch(error => { console.error(error); process.exitCode = 1; });

