const fs = require('fs');
const assert = require('assert');
const version = fs.readFileSync('VERSION.txt', 'utf8').trim();
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
assert.strictEqual(version, '2.5.442');
assert(sw.includes("var GAME_CACHE = 'ro-idle-runtime-v" + version + "';"), 'service worker cache must match VERSION.txt');
assert(!sw.includes("ro-idle-runtime-v1'"), 'legacy fixed cache name must be removed');
assert(sw.includes('caches.delete(name)'), 'activation must remove stale project runtime caches');
const refs = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))\?v=([^"&]+)/g)];
assert(refs.length > 0, 'versioned JS/CSS references must exist');
for (const [, asset, queryVersion] of refs) {
  assert.strictEqual(queryVersion, version, asset + ' query version mismatch');
  assert(fs.existsSync(asset), asset + ' referenced by index.html must exist');
}
assert(!/\?v=2\.5\.441/.test(html), 'no stale asset query versions');
console.log('PASS VERSION.txt / Service Worker cache version match');
console.log('PASS old runtime cache namespace is retired on activation');
console.log('PASS all ' + refs.length + ' JS/CSS references exist and use v' + version);
console.log('3/3 passed');
