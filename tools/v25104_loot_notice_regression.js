#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
const checks = [];
function check(name, ok) { checks.push({name, ok: !!ok}); }
check('loot notices are recorded only through dedicated helper', /function recordLootNotice\(itemId, qty, source\)/.test(engine));
check('single chest/card-book open records the received item', /recordLootNotice\(got,\s*1,\s*def\.boxOpen === 'violet' \? '紫箱' : '卡冊'\)/.test(engine));
check('bulk opening records aggregated quantities', /recordLootNotice\(id,\s*q,\s*def\.boxOpen === 'violet' \? '紫箱' : '卡冊'\)/.test(engine));
check('source distinguishes card books from ordinary treasure boxes', /'紫箱'\s*:\s*'卡冊'/.test(engine));
check('loot history is capped at 30 entries', /lootNotices\.length > 30/.test(engine));
check('feed displays the latest three rewards', /slice\(-3\)\.reverse\(\)/.test(ui));
check('feed supports collapse and expand', /_lootFeedCollapsed=!_lootFeedCollapsed/.test(ui));
check('loot feed provides a detailed history panel', /function openLootNoticeHistory\(\)/.test(ui) && /loot-notice-row/.test(ui));
check('detail panel displays item description and source', /def\.desc/.test(ui) && /來源：/.test(ui));
check('feed is anchored over the battle scene bubble area', /id="loot-notice-feed"/.test(html) && /\.loot-notice-feed\s*\{[\s\S]*?position:\s*absolute/.test(css));
check('loot detail modal exists', /id="loot-detail-modal"/.test(html) && /\.loot-detail-modal/.test(css));
const failed = checks.filter(x => !x.ok);
checks.forEach(x => console.log(`${x.ok ? 'PASS' : 'FAIL'} ${x.name}`));
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length) process.exit(1);
