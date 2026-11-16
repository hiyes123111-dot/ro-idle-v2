const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const version=fs.readFileSync(path.join(root,'VERSION.txt'),'utf8').trim();
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.strictEqual(version,'2.5.445');
assert(sw.includes(`var GAME_CACHE = 'ro-idle-runtime-v${version}';`));
assert(sw.includes('caches.delete(name)'));
const refs=[...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))\?v=([^"&]+)/g)];
assert.strictEqual(refs.length,58);
for(const [,asset,q] of refs){assert.strictEqual(q,version,`${asset} version`);assert(fs.existsSync(path.join(root,asset)),`${asset} exists`);}
console.log(`PASS ${refs.length} resource references, VERSION.txt and Service Worker cache all match ${version}`);
