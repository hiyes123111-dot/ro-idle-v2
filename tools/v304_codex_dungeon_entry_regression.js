#!/usr/bin/env node
// v2.5.304: Codex discoverability and EP21 dungeon-entry regression.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const dataSrc = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const uiSrc = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const engineSrc = fs.readFileSync(path.join(root, 'js/engine.js'), 'utf8');
const data = vm.runInNewContext(dataSrc + `\nJSON.parse(JSON.stringify({\n  monster: MONSTERS.ill_kraken, card: CARDS.ill_kraken_card, item: ITEMS.ill_kraken_card,\n  highMap: MAPS.find(m => m.id === 'high_exp_208'),\n  trialMap: MAPS.find(m => m.id === 'ep21_final_trial_hell'),\n  trialRegion: REGIONS.find(r => r.id === 'r_ep21'),\n  kingdom: KINGDOMS.find(k => k.id === 'k_midgarts'),\n  cardDrop: MONSTER_CARD_DROPS.ill_kraken\n}))`, { console, Math, Set, Map, Object, Array, String, Number, JSON });
const checks = [];
function check(name, ok, detail='') { checks.push({name,ok:!!ok,detail}); }
check('深淵海神怪物資料存在', !!data.monster && data.monster.imgId === 20811);
check('深淵海神卡片道具與效果資料存在', !!data.item && !!data.card && data.card.bonus.rangedDmgPct === 25);
check('高經驗值地圖配置深淵海神', !!data.highMap && data.highMap.monsters.some(x => x.id === 'ill_kraken'));
check('卡片掉落表連到深淵海神', !!data.cardDrop && data.cardDrop.card === 'ill_kraken_card' && data.cardDrop.chance === 0.0001);
check('怪物圖鑑顯示名稱可用「深淵海神」搜尋', uiSrc.includes("ill_kraken: '深淵海神'"));
check('EP21 副本獨立地區存在', !!data.trialRegion && data.trialRegion.maps.includes('ep21_final_trial_hell'));
check('EP21 地區已掛入王國選單', !!data.kingdom && data.kingdom.regions.includes('r_ep21'));
check('地圖分頁有常駐直接進入副本入口', uiSrc.includes('直接進入副本') && /onclick=\"enterEp21FinalTrial\(\)\"/.test(uiSrc));
check('圖鑑來源快取包含卡片掉落表簽章', engineSrc.includes('Object.entries(MONSTER_CARD_DROPS)'));
check('深淵海神怪物圖檔位於 images/monsters', fs.existsSync(path.join(root,'images/monsters/20811.png')));
for (const c of checks) console.log(`${c.ok?'PASS':'FAIL'} ${c.name}${c.detail?' — '+c.detail:''}`);
console.log(`\n${checks.filter(x=>x.ok).length}/${checks.length} checks passed`);
if (checks.some(x=>!x.ok)) process.exit(1);
